// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo, useMemo, useState } from 'react';
// Components
import { RadioGroup } from '@logicalclocks/quartz';
import { Flex } from 'rebass';
import NewLibrarySearch from './NewLibrarySearch';
import {
  PythonLibraryDTO,
  PythonLibrarySearchDTO,
} from '../../../../../types/python';
import NewLibraryName from './NewLibraryName';
import NewLibraryFile from './NewLibraryFile';

export enum PipInstallMode {
  SEARCH = 'Search',
  SIMPLE = 'Name/version',
  REQ = 'Add requirements.txt',
}

interface PipFormProps {
  installedLibraries: PythonLibraryDTO[];
  setInstallCount: (arg: number) => void;
  installCount: number;
  isInstallingFc: (lib: PythonLibrarySearchDTO | PythonLibraryDTO) => boolean;
  isInstallingFailedFc: (
    lib: PythonLibrarySearchDTO | PythonLibraryDTO,
  ) => boolean;
  isDeletingFc: (lib: PythonLibrarySearchDTO | PythonLibraryDTO) => boolean;
  setIsOpenExplorerFromPopup: (arg: boolean) => void;
  setIsRequesting: (arg: boolean) => void;
  isRequesting: boolean;
  postInstallationCheck: (arg: number) => void;
}

const PipForm: FC<PipFormProps> = ({
  installedLibraries,
  setInstallCount,
  installCount,
  isInstallingFc,
  isInstallingFailedFc,
  isDeletingFc,
  setIsOpenExplorerFromPopup,
  setIsRequesting,
  isRequesting,
  postInstallationCheck,
}) => {
  const [getInstallMode, setInstallMode] = useState<PipInstallMode>(
    PipInstallMode.SEARCH,
  );

  const content = useMemo(() => {
    switch (getInstallMode) {
      case PipInstallMode.SIMPLE:
        return (
          <NewLibraryName
            packageSource="PIP"
            installCount={installCount}
            isInstallingFc={isInstallingFc}
            setIsRequesting={setIsRequesting}
            isRequesting={isRequesting}
            isInstallingFailedFc={isInstallingFailedFc}
            postInstallationCheck={postInstallationCheck}
          />
        );
      case PipInstallMode.REQ:
        return (
          <NewLibraryFile
            label="Pick a requirements.txt"
            fileNamePattern={RegExp(`.*.txt$`)}
            setIsRequesting={setIsRequesting}
            channelUrl="requirements_txt"
            packageSource="REQUIREMENTS_TXT"
            isRequesting={isRequesting}
            setIsOpenExplorerFromPopup={setIsOpenExplorerFromPopup}
            postInstallationCheck={postInstallationCheck}
          />
        );
      case PipInstallMode.SEARCH:
        return (
          <NewLibrarySearch
            installedLibraries={installedLibraries}
            manager="pip"
            packageSource="PIP"
            isInstallingFc={isInstallingFc}
            isInstallingFailedFc={isInstallingFailedFc}
            setIsRequesting={setIsRequesting}
            isDeletingFc={isDeletingFc}
            postInstallationCheck={postInstallationCheck}
            installCount={installCount}
          />
        );
      default:
        return <></>;
    }
  }, [
    postInstallationCheck,
    isRequesting,
    setIsRequesting,
    isDeletingFc,
    isInstallingFailedFc,
    isInstallingFc,
    installCount,
    getInstallMode,
    installedLibraries,
    setIsOpenExplorerFromPopup,
  ]);

  return (
    <Flex flexDirection="column">
      <RadioGroup
        flexDirection="row"
        mr="8px"
        mb="8px"
        onChange={(value) => {
          setInstallMode(value as PipInstallMode);
          setInstallCount(0);
        }}
        options={Object.values(PipInstallMode)}
        value={getInstallMode}
      />
      <Flex flexDirection="column" mt="8px">
        {content}
      </Flex>
    </Flex>
  );
};

export default memo(PipForm);
