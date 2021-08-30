// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo, useMemo, useState } from 'react';
// Components
import { RadioGroup, Labeling, Input } from '@logicalclocks/quartz';
import { Flex } from 'rebass';
import NewLibrarySearch from './NewLibrarySearch';
import {
  PythonLibraryDTO,
  PythonLibrarySearchDTO,
} from '../../../../../types/python';
import NewLibraryName from './NewLibraryName';
import NewLibraryFile from './NewLibraryFile';

enum CondaInstallMode {
  SEARCH = 'Search',
  SIMPLE = 'Name/version',
  ENV = 'Add environment YAML',
}

interface CondaFormProps {
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

const CondaForm: FC<CondaFormProps> = ({
  installedLibraries,
  installCount,
  isInstallingFc,
  isInstallingFailedFc,
  isDeletingFc,
  setIsOpenExplorerFromPopup,
  setIsRequesting,
  isRequesting,
  postInstallationCheck,
  setInstallCount,
}) => {
  const [getInstallMode, setInstallMode] = useState<CondaInstallMode>(
    CondaInstallMode.SEARCH,
  );
  const [channel, setChannel] = useState<string>('defaults');

  const content = useMemo(() => {
    switch (getInstallMode) {
      case CondaInstallMode.SEARCH:
        return (
          <>
            <Flex flexDirection="column" mb="20px">
              <Labeling bold mb="8px">
                Conda Channel
              </Labeling>
              <Input
                value={channel}
                width="100%"
                onChange={(event) => setChannel(event.target.value)}
              />
            </Flex>
            <NewLibrarySearch
              postInstallationCheck={postInstallationCheck}
              installedLibraries={installedLibraries}
              manager="conda"
              packageSource="CONDA"
              channel={channel}
              isInstallingFc={isInstallingFc}
              isInstallingFailedFc={isInstallingFailedFc}
              isDeletingFc={isDeletingFc}
              installCount={installCount}
              setIsRequesting={setIsRequesting}
            />
          </>
        );
      case CondaInstallMode.SIMPLE:
        return (
          <NewLibraryName
            postInstallationCheck={postInstallationCheck}
            isRequesting={isRequesting}
            packageSource="CONDA"
            installCount={installCount}
            isInstallingFc={isInstallingFc}
            setIsRequesting={setIsRequesting}
            isInstallingFailedFc={isInstallingFailedFc}
          />
        );
      case CondaInstallMode.ENV:
        return (
          <NewLibraryFile
            label="Pick a YAML file"
            isRequesting={isRequesting}
            fileNamePattern={RegExp(`.*.yml$`)}
            channelUrl="environment_yaml"
            packageSource="ENVIRONMENT_YAML"
            setIsRequesting={setIsRequesting}
            setIsOpenExplorerFromPopup={setIsOpenExplorerFromPopup}
            postInstallationCheck={postInstallationCheck}
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
    installedLibraries,
    getInstallMode,
    setIsOpenExplorerFromPopup,
    channel,
  ]);

  return (
    <Flex flexDirection="column">
      <RadioGroup
        flexDirection="row"
        mr="8px"
        my="8px"
        onChange={(value) => {
          setInstallMode(value as CondaInstallMode);
          setInstallCount(0);
        }}
        options={Object.values(CondaInstallMode)}
        value={getInstallMode}
      />
      <Flex flexDirection="column" mt="8px">
        {content}
      </Flex>
    </Flex>
  );
};

export default memo(CondaForm);
