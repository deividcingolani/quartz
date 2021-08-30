// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo, useEffect, useState } from 'react';
import { Card } from '@logicalclocks/quartz';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Box } from 'rebass';
import PythonOngoingOperations from './ongoingOperations/PythonOngoingOperations';
import {
  usePythonConflicts,
  usePythonEnvironmentWithOperations,
  usePythonLibrariesWithOperations,
} from './usePython';
import {
  OngoingOperationStatus,
  OngoingOperationType,
  PythonCommandDTO,
  PythonCommandListDTO,
  PythonConflictListDTO,
  PythonEnvironmentDTO,
  PythonLibraryListDTO,
} from '../../../../types/python';
import Loader from '../../../../components/loader/Loader';
import { Dispatch } from '../../../../store';
import routeNames from '../../../../routes/routeNames';
import useProject from '../useProject';
import PythonInstalledLibraries from './installedLibraries/PythonInstalledLibraries';
import getHrefNoMatching from '../../../../utils/getHrefNoMatching';
import { APIError } from '../../../../types/error';

const PythonWithEnvironment: FC = () => {
  const { id: projectId, version } = useParams();
  const { data: dataEnvironmentWithOperations } =
    usePythonEnvironmentWithOperations(+projectId, version);

  const { project } = useProject(+projectId);

  const { data: dataLibrariesWithOperations, isLoading: isLoadingLibraries } =
    usePythonLibrariesWithOperations(+projectId, version);

  const { data: dataConflicts, isLoading: isLoadingConflicts } =
    usePythonConflicts(+projectId, version);

  const isAPIError = (obj?: any) => obj && 'errorMsg' in obj;

  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigate();

  const [operations, setOperations] = useState<PythonCommandDTO[]>([]);
  const [isLoadingOperations, setIsLoadingOperations] = useState<boolean>(true);

  const [isEnvSyncing, setIsEnvSyncing] = useState<boolean>(false);
  useEffect(() => {
    if (
      dataEnvironmentWithOperations === undefined ||
      dataLibrariesWithOperations === undefined
    ) {
      setOperations([]);
      return;
    }

    if (isAPIError(dataEnvironmentWithOperations)) {
      navigate(
        getHrefNoMatching(
          routeNames.project.settings.python,
          routeNames.project.value,
          true,
          { id: projectId },
        ),
      );
      return;
    }

    const libraryOperations: PythonCommandDTO[] =
      isAPIError(dataLibrariesWithOperations) ||
      (dataLibrariesWithOperations as PythonLibraryListDTO).count === 0
        ? []
        : (dataLibrariesWithOperations as PythonLibraryListDTO).items
            .filter(
              (library) =>
                (library.commands as PythonCommandListDTO).count !== 0,
            )
            .map((library) => {
              return (library.commands as PythonCommandListDTO).items.map(
                (command) => {
                  return { ...command, subject: library };
                },
              );
            })
            .flat();

    const envCommandList = (
      dataEnvironmentWithOperations as PythonEnvironmentDTO
    ).commands as PythonCommandListDTO;

    const environmentOperations: PythonCommandDTO[] =
      envCommandList.count !== 0
        ? envCommandList.items.map((command) => {
            return {
              ...command,
              subject: dataEnvironmentWithOperations as PythonEnvironmentDTO,
            };
          })
        : [];

    setIsEnvSyncing(
      !!environmentOperations.find(
        (op) => op.op === OngoingOperationType.SYNC_BASE_ENV,
      ),
    );

    const onGoingCheck = (operation: PythonCommandDTO) => {
      return (
        operation.status === OngoingOperationStatus.ONGOING ||
        operation.status === OngoingOperationStatus.NEW
      );
    };
    const onGoingEnvOp = environmentOperations.find(onGoingCheck);
    const onGoingLibOp = libraryOperations.find(onGoingCheck);

    const operationsT = [...environmentOperations, ...libraryOperations];

    // TODO ISSUE HERE
    // When updating hops and hsfs:
    // I think commands are fetched by name only, so the install operation of 2.x ends up
    // in the command list of hops 1.0 and, and the uninstall of 1.0 in the commands of 2.x

    setOperations(operationsT);
    setIsLoadingOperations(false);

    if (onGoingLibOp || onGoingEnvOp) {
      setTimeout(() => {
        if (onGoingLibOp) {
          dispatch.pythonLibrary.getLibrariesWithOperations({
            id: +projectId,
            version,
          });
        }
        if (onGoingEnvOp) {
          dispatch.pythonEnvironment
            .getPythonEnvironmentWithOperations({
              id: +projectId,
              version,
            })
            .then((newEnv: PythonEnvironmentDTO | APIError) => {
              if (isAPIError(newEnv)) {
                navigate(
                  getHrefNoMatching(
                    routeNames.project.settings.python,
                    routeNames.project.value,
                    true,
                    { id: projectId },
                  ),
                );
                return; // unlikely
              }
              if (
                (
                  (newEnv as PythonEnvironmentDTO)
                    .commands as PythonCommandListDTO
                ).count === 0
              ) {
                dispatch.pythonConflict.getPythonConflicts({
                  id: +projectId,
                  version,
                });
                dispatch.pythonLibrary.getLibrariesWithOperations({
                  id: +projectId,
                  version,
                });
              }
            });
        }
      }, 5000);
    }
    // setOperations(operationsT);
  }, [
    version,
    dataLibrariesWithOperations,
    dataEnvironmentWithOperations,
    dispatch,
    projectId,
    navigate,
  ]);

  if (dataEnvironmentWithOperations === undefined) {
    return <Loader />;
  }

  return (
    <Box>
      <Card title="Ongoing Operations">
        <PythonOngoingOperations
          data={operations}
          isLoadingOperations={isLoadingOperations}
        />
      </Card>
      <Card my="20px" title="Installed Python Libraries">
        <PythonInstalledLibraries
          isLoadingLibraries={isLoadingLibraries}
          isEnvSyncing={isEnvSyncing}
          project={project}
          dataLibraries={(() => {
            if (
              !dataLibrariesWithOperations ||
              isAPIError(dataLibrariesWithOperations)
            ) {
              return [];
            }
            return (dataLibrariesWithOperations as PythonLibraryListDTO)
              .count === 0
              ? []
              : (dataLibrariesWithOperations as PythonLibraryListDTO).items;
          })()}
          dataConflicts={(() => {
            if (!dataConflicts || isAPIError(dataConflicts)) {
              return [];
            }
            return (dataConflicts as PythonConflictListDTO).items || [];
          })()}
          dataOperations={operations}
          isLoadingConflicts={isLoadingConflicts}
        />
      </Card>
    </Box>
  );
};

export default memo(PythonWithEnvironment);
