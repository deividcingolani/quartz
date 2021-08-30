// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo, useCallback, useEffect, useState } from 'react';
// Components
import { Box, Flex } from 'rebass';
import {
  Value,
  Labeling,
  Button,
  CalloutTypes,
  CalloutWithButton,
  TinyPopup,
  usePopup,
  NotificationsManager,
} from '@logicalclocks/quartz';

import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PythonInstalledLibrariesList from './PythonInstalledLibrariesList';
import PythonNewLibrary from '../newLibrary/PythonNewLibrary';
import {
  PythonCommandDTO,
  PythonConflictDTO,
  PythonLibraryDTO,
} from '../../../../../types/python';
import { Dispatch } from '../../../../../store';
import routeNames from '../../../../../routes/routeNames';
import Loader from '../../../../../components/loader/Loader';
import { Project } from '../../../../../types/project';
import NotificationBadge from '../../../../../utils/notifications/notificationBadge';
import NotificationContent from '../../../../../utils/notifications/notificationValue';
import DatasetService, {
  DatasetType,
} from '../../../../../services/project/DatasetService';
import getHrefNoMatching from '../../../../../utils/getHrefNoMatching';
import { APIError } from '../../../../../types/error';

export interface PythonInstalledLibrariesProps {
  dataLibraries: PythonLibraryDTO[];
  dataConflicts: PythonConflictDTO[];
  dataOperations: PythonCommandDTO[];
  project: Project;
  isEnvSyncing: boolean;
  isLoadingConflicts: boolean;
  isLoadingLibraries: boolean;
}

const PythonInstalledLibraries: FC<PythonInstalledLibrariesProps> = ({
  dataLibraries,
  isLoadingConflicts,
  isLoadingLibraries,
  isEnvSyncing,
  dataConflicts,
  dataOperations,
  project,
}) => {
  const [isRemoveEnvPopupOpen, handleToggleRemoveEnv] = usePopup(false);
  const [isConflictPopupOpen, handleToggleConflict] = usePopup(false);
  const [isNewLibraryPopupOpen, handleToggleNewLibrary] = usePopup(false);
  const [isRemovingEnvironment, setIsRemovingEnvironment] =
    useState<boolean>(false);
  const [isUpdatingLibs, setIsUpdatingLibs] = useState<boolean>(false);
  const [hasInstalledWithRunningServer, setHasInstalledWithRunningServer] =
    useState<boolean>(false);
  const [isExportingEnvironment, setIsExportingEnvironment] =
    useState<boolean>(false);

  const dispatch = useDispatch<Dispatch>();
  const { id: projectId, version } = useParams();
  const navigate = useNavigate();

  const postInstallationCheck = useCallback(() => {
    dispatch.jupyter
      .fetchRunningServer({ projectId: +projectId })
      .then(() => {
        setHasInstalledWithRunningServer(true);
        // TODO should this only be done if the installation was successful == keep track of the operation?
      })
      .catch((err: any) => {
        if (err.response?.data) {
          const error = err.response.data;
          if ('errorCode' in error) {
            if ((error as APIError).errorCode === 100033) {
              setHasInstalledWithRunningServer(false);
            }
          }
        }
        // TODO if running, then not running, forgetting that some installations were made when it was running?
      });
  }, [dispatch.jupyter, projectId, setHasInstalledWithRunningServer]);

  const onRemoveEnvSubmit = useCallback(async () => {
    handleToggleRemoveEnv();
    setIsRemovingEnvironment(true);
    await dispatch.pythonEnvironment
      .delete({
        id: +projectId,
        version,
      })
      .then(() => {
        setIsRemovingEnvironment(false);
        navigate(
          getHrefNoMatching(
            routeNames.project.settings.python,
            routeNames.project.value,
            true,
            { id: projectId },
          ),
        );
      });
  }, [navigate, handleToggleRemoveEnv, dispatch, projectId, version]);

  const handleDownloadFile = async () => {
    setIsExportingEnvironment(true);
    DatasetService.download(
      +projectId,
      '/Resources/.python/environment.yml',
      DatasetType.DATASET,
    )
      .then(() => {
        setIsExportingEnvironment(false);
      })
      .catch((err) => {
        if (err.response?.data) {
          const error = err.response.data;
          if ('errorCode' in error) {
            NotificationsManager.create({
              isError: true,
              type: <NotificationBadge message="Error" variant="fail" />,
              content: (
                <NotificationContent message={(error as APIError).errorMsg} />
              ),
            });
          }
        }
        setIsExportingEnvironment(false);
      });
  };

  const libHasToUpdate = (libName: string) => {
    return dataLibraries.find(
      (lib) =>
        lib.library === libName &&
        lib.latestVersion &&
        lib.latestVersion !== lib.version,
    );
  };

  const libHasOperation = useCallback(
    (libName: string) => {
      return dataOperations.find(
        (op) => 'library' in op.subject! && op.subject.library === libName,
      );
    },
    [dataOperations],
  );

  const toUpdate: PythonLibraryDTO[] = [
    libHasToUpdate('hsfs'),
    libHasToUpdate('hops'),
  ].filter((el) => el !== undefined) as PythonLibraryDTO[];

  useEffect(() => {
    if (isUpdatingLibs) {
      if (
        !libHasOperation('hsfs') &&
        !libHasOperation('hops') &&
        toUpdate.length === 0
        // no operations + no libraries to update
      ) {
        setIsUpdatingLibs(false);
      }
    }
  }, [toUpdate.length, libHasOperation, setIsUpdatingLibs, isUpdatingLibs]);

  const onUpdateLib = useCallback(async () => {
    const promise = Promise.resolve();
    setIsUpdatingLibs(true);

    toUpdate.forEach((lib: PythonLibraryDTO) => {
      promise
        .then(() => {
          return dispatch.pythonLibrary.uninstallLibrary({
            id: +projectId,
            version,
            name: lib.library,
          });
        })
        .then(() => {
          return dispatch.pythonLibrary
            .installLibrary({
              id: +projectId,
              version,
              name: lib.library,
              data: {
                version: lib.latestVersion,
                library: lib.library,
                packageSource: lib.packageSource,
                channelUrl: lib.channel,
              },
            })
            .catch(() => {
              setIsUpdatingLibs(false);
            });
        });
    });

    promise
      .then(() => {
        postInstallationCheck();
        return dispatch.pythonLibrary
          .getLibrariesWithOperations({
            id: +projectId,
            version,
          })
          .catch(() => {
            setIsUpdatingLibs(false);
          });
      })
      .then(() => {
        NotificationsManager.create({
          isError: false,
          type: <NotificationBadge message="Success" variant="success" />,
          content: <NotificationContent message="hops/hsfs update requested" />,
        });
      });
  }, [
    postInstallationCheck,
    projectId,
    version,
    dispatch.pythonLibrary,
    toUpdate,
  ]);
  // TODO could lead to a successful uninstallation and unsuccessful installation
  // in which the "to update" array would be empty

  const hasConflicts =
    dataConflicts !== undefined && dataConflicts.length !== 0;

  if (isRemovingEnvironment) {
    return <Loader />;
  }
  return (
    <>
      <PythonNewLibrary
        installedLibraries={dataLibraries}
        isNewLibraryPopupOpen={isNewLibraryPopupOpen}
        handleToggleNewLibrary={handleToggleNewLibrary}
        version={version}
        operations={dataOperations}
        postInstallationCheck={postInstallationCheck}
      />
      {hasConflicts && (
        <TinyPopup
          title="Environment conflicts"
          secondaryText=""
          isOpen={isConflictPopupOpen}
          secondaryButton={['Done', handleToggleConflict]}
          onClose={handleToggleConflict}
        >
          <Box mb="20px">
            {isLoadingConflicts || dataConflicts === undefined ? (
              'Loading'
            ) : (
              <ul style={{ paddingLeft: '20px', marginRight: '11px' }}>
                {dataConflicts.map(({ conflict, service }) => (
                  <Flex
                    as="li"
                    my="8px"
                    flexGrow={1}
                    justifyContent="space-between"
                    key={conflict}
                  >
                    <li style={{ fontSize: '12px', wordBreak: 'break-word' }}>
                      <Labeling>
                        {conflict}
                        {service !== undefined ? ` (Service : ${service})` : ''}
                      </Labeling>
                    </li>
                  </Flex>
                ))}
              </ul>
            )}
          </Box>
        </TinyPopup>
      )}
      <TinyPopup
        title="Remove Environment"
        secondaryText="Once you remove the environment, there is no going back. Please be certain."
        isOpen={isRemoveEnvPopupOpen}
        mainButton={['Remove environment', onRemoveEnvSubmit]}
        secondaryButton={['Cancel', handleToggleRemoveEnv]}
        onClose={handleToggleRemoveEnv}
      />
      <Flex width="100%" py="5px">
        <Labeling>Current python version is {version}. More in the</Labeling>
        <Button
          onClick={() =>
            window.open(
              'https://hopsworks.readthedocs.io/en/latest/user_guide/hopsworks/python.html?highlight=python#recreating-environment',
              '_blank',
            )
          }
          p={0}
          intent="inline"
          ml="3px"
        >
          documentation ↗
        </Button>
      </Flex>
      <Flex
        width="100%"
        py="5px"
        alignItems="center"
        justifyContent="space-between"
      >
        <Flex>
          <Value primary mx="3px">
            {dataLibraries.length}
          </Value>
          <Value>python libraries installed</Value>
        </Flex>
        <Flex>
          <Button
            variant="secondary"
            ml="8px"
            onClick={handleDownloadFile}
            disabled={isExportingEnvironment}
          >
            Export env
          </Button>
          <Button variant="alert" ml="8px" onClick={handleToggleRemoveEnv}>
            Remove env
          </Button>
          <Button variant="primary" ml="8px" onClick={handleToggleNewLibrary}>
            New library
          </Button>
        </Flex>
      </Flex>

      {hasConflicts && (
        <CalloutWithButton
          mt="20px"
          type={CalloutTypes.warning}
          content={`${
            isLoadingConflicts || dataConflicts.length
          } conflicts were detected in the list of python libraries`}
          onClick={handleToggleConflict}
          buttonContent="See conflicts"
        />
      )}

      {project && project.isOldDockerImage && (
        <CalloutWithButton
          mt="20px"
          type={CalloutTypes.warning}
          content="This project is using an old environment,
        please recreate the environment if it's causing issues."
          onClick={() =>
            window.open(
              'https://hopsworks.readthedocs.io/en/latest/user_guide/hopsworks/python.html?highlight=python#recreating-environment',
              '_blank',
            )
          }
          buttonContent="Open documentation"
        />
      )}

      {((libHasToUpdate('hsfs') && !libHasOperation('hsfs')) ||
        (libHasToUpdate('hops') && !libHasOperation('hops'))) && (
        <CalloutWithButton
          mt="20px"
          type={CalloutTypes.warning}
          content="A new version of hops/hsfs is available"
          onClick={onUpdateLib}
          buttonContent="Update Library"
          disabledButton={isUpdatingLibs}
        />
      )}

      {hasInstalledWithRunningServer && (
        <CalloutWithButton
          mt="20px"
          type={CalloutTypes.warning}
          content="You installed a new python library while
        running the notebook server. To be able to use it, you need
        to restart the Jupyter notebook server."
          onClick={() => {
            setHasInstalledWithRunningServer(false);
            // TODO not sure if should be disabled now or if should somehow know whether the server was restarted
            navigate(
              getHrefNoMatching('/jupyter', routeNames.project.value, true, {
                id: projectId,
              }),
            );
          }}
          buttonContent="Go to server configuration"
        />
      )}
      <PythonInstalledLibrariesList
        version={version}
        loading={isLoadingLibraries}
        syncing={isEnvSyncing}
        data={dataLibraries}
      />
    </>
  );
};

export default memo(PythonInstalledLibraries);
