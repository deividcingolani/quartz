// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Labeling, Popup, RadioGroup } from '@logicalclocks/quartz';
import { Box, Flex } from 'rebass';
import PipForm from './PipForm';
import CondaForm from './CondaForm';
import WheelForm from './WheelForm';
import GitForm from './GitForm';
import {
  OngoingOperationStatus,
  OngoingOperationType,
  PythonCommandDTO,
  PythonLibraryDTO,
  PythonLibrarySearchDTO,
} from '../../../../../types/python';

export interface PythonNewLibraryProps {
  isNewLibraryPopupOpen: boolean;
  handleToggleNewLibrary: () => void;
  postInstallationCheck: () => void;
  version: string;
  installedLibraries: PythonLibraryDTO[]; // to retrieve the version of installed libraries in the search form
  operations: PythonCommandDTO[]; // to check the installation status of searched libraries
}

export enum InstallType {
  PIP = 'Pip',
  CONDA = 'Conda',
  WHEEL_EGG = 'Wheel / Egg',
  GIT = 'Git',
}

const PythonNewLibrary: FC<PythonNewLibraryProps> = ({
  isNewLibraryPopupOpen,
  handleToggleNewLibrary,
  version,
  installedLibraries,
  operations,
  postInstallationCheck,
}) => {
  const [getInstallType, setInstallType] = useState<InstallType>(
    InstallType.PIP,
  );
  const [installCount, setInstallCount] = useState<number>(0);
  const [isOpenExplorerFromPopup, setIsOpenExplorerFromPopup] =
    useState<boolean>(false);
  const [isRequesting, setIsRequesting] = useState<boolean>(false);

  useEffect(() => {
    const installationOperations = !!operations.find((operation) => {
      return (
        'library' in operation.subject! &&
        operation.op === OngoingOperationType.INSTALL &&
        [OngoingOperationStatus.NEW, OngoingOperationStatus.ONGOING].includes(
          operation.status,
        )
      );
    });

    if (!installationOperations) {
      setInstallCount(0);
    }
  }, [operations, setInstallCount]);

  const operationInStatusFromOperations = useCallback(
    (
      lib: PythonLibrarySearchDTO | PythonLibraryDTO,
      operationType: OngoingOperationType,
      statusArr: OngoingOperationStatus[],
    ) => {
      return !!operations.find((operation) => {
        return (
          'library' in operation.subject! &&
          (operation.subject as PythonLibraryDTO).library === lib.library &&
          statusArr.includes(operation.status) &&
          operation.op === operationType
        );
      });

      // return (
      // PythonLibrarySearchInstallationStatus.INSTALLED returned
      // even if really, ongoing, new, failed, success
      //  lib.status === PythonLibrarySearchInstallationStatus.INSTALLED && op
      // );
    },
    [operations],
  );

  const newPostInstallationCheck = useCallback(
    (newInstallCount: number) => {
      postInstallationCheck();
      setInstallCount(newInstallCount);
    },
    [postInstallationCheck, setInstallCount],
  );

  const isInstallingFc = useCallback(
    (lib: PythonLibrarySearchDTO | PythonLibraryDTO) =>
      operationInStatusFromOperations(lib, OngoingOperationType.INSTALL, [
        OngoingOperationStatus.NEW,
        OngoingOperationStatus.ONGOING,
      ]),
    [operationInStatusFromOperations],
  );

  const isInstallFailedFc = useCallback(
    (lib: PythonLibrarySearchDTO | PythonLibraryDTO) =>
      operationInStatusFromOperations(lib, OngoingOperationType.INSTALL, [
        OngoingOperationStatus.FAILED,
      ]),
    [operationInStatusFromOperations],
  );

  const isDeletingFc = useCallback(
    (lib: PythonLibrarySearchDTO | PythonLibraryDTO) =>
      operationInStatusFromOperations(lib, OngoingOperationType.UNINSTALL, [
        OngoingOperationStatus.NEW,
        OngoingOperationStatus.ONGOING,
      ]),
    [operationInStatusFromOperations],
  );

  const content = useMemo(() => {
    switch (getInstallType) {
      case InstallType.PIP:
        return (
          <PipForm
            installedLibraries={installedLibraries}
            setInstallCount={setInstallCount}
            installCount={installCount}
            isInstallingFc={isInstallingFc}
            isInstallingFailedFc={isInstallFailedFc}
            isDeletingFc={isDeletingFc}
            setIsRequesting={setIsRequesting}
            isRequesting={isRequesting}
            setIsOpenExplorerFromPopup={setIsOpenExplorerFromPopup}
            postInstallationCheck={newPostInstallationCheck}
          />
        );
      case InstallType.CONDA:
        return (
          <CondaForm
            installedLibraries={installedLibraries}
            setInstallCount={setInstallCount}
            installCount={installCount}
            isInstallingFc={isInstallingFc}
            isInstallingFailedFc={isInstallFailedFc}
            isDeletingFc={isDeletingFc}
            isRequesting={isRequesting}
            setIsRequesting={setIsRequesting}
            setIsOpenExplorerFromPopup={setIsOpenExplorerFromPopup}
            postInstallationCheck={newPostInstallationCheck}
          />
        );
      case InstallType.WHEEL_EGG:
        return (
          <WheelForm
            setInstallCount={setInstallCount}
            installCount={installCount}
            setIsRequesting={setIsRequesting}
            isRequesting={isRequesting}
            setIsOpenExplorerFromPopup={setIsOpenExplorerFromPopup}
            postInstallationCheck={newPostInstallationCheck}
          />
        );
      case InstallType.GIT:
        return (
          <GitForm
            setIsRequesting={setIsRequesting}
            isRequesting={isRequesting}
            setInstallCount={setInstallCount}
            installCount={installCount}
            postInstallationCheck={newPostInstallationCheck}
          />
        );
      default:
        return <></>;
    }
  }, [
    newPostInstallationCheck,
    isRequesting,
    setIsRequesting,
    isDeletingFc,
    isInstallingFc,
    isInstallFailedFc,
    getInstallType,
    installedLibraries,
    setInstallCount,
    installCount,
  ]);

  const onInstallTypeChange = (value: string) => {
    setInstallType(value as InstallType);
    setInstallCount(0);
  };

  const popupControls = useMemo(() => {
    return (
      <Box display="flex" mt="auto" p="20px">
        <Box display="flex" mr="auto">
          {!isRequesting && installCount !== 0 && (
            <Labeling bold ml="8px" mt="8px">
              {`${installCount !== 1000 ? installCount : ''} Librar${
                installCount !== 1 ? 'ies' : 'y'
              } installing`}
            </Labeling>
          )}
        </Box>
        <Box display="flex" ml="auto">
          {isRequesting && (
            <Labeling gray mr="8px" mt="8px">
              requesting...
            </Labeling>
          )}
          <Button intent="secondary" onClick={handleToggleNewLibrary}>
            Done
          </Button>
        </Box>
      </Box>
    );
  }, [handleToggleNewLibrary, installCount, isRequesting]);

  return (
    <Popup
      isOpen={isNewLibraryPopupOpen}
      onClose={() => {
        setInstallCount(0);
        handleToggleNewLibrary();
      }}
      width={!isOpenExplorerFromPopup ? '40%' : '100%'}
      height="95%"
      footer={popupControls}
      overflowY="visible"
    >
      <Flex flexDirection="column" p="20px">
        <Labeling bold> Install new Library</Labeling>

        <Flex width="100%" py="20px">
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

        <RadioGroup
          flexDirection="row"
          mr="8px"
          my="8px"
          onChange={onInstallTypeChange}
          options={Object.values(InstallType)}
          value={getInstallType}
        />
        <hr
          style={{
            borderBottom: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            borderTop: '1px solid lightgray',
            width: '99%',
          }}
        />
        <Flex flexDirection="column" mt="20px">
          {content}
        </Flex>
      </Flex>
    </Popup>
  );
};

export default PythonNewLibrary;
