import { Box, Flex } from 'rebass';
// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, {
  ChangeEvent,
  FC,
  memo,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Button, Input, Labeling } from '@logicalclocks/quartz';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Dispatch } from '../../../../../store';
import { PythonLibraryDTO } from '../../../../../types/python';

interface NewLibraryNameProps {
  packageSource: string;
  channel?: string;
  // setInstallCount: (arg: number) => void;
  setIsRequesting: (arg: boolean) => void;
  installCount: number;
  isInstallingFc: (lib: PythonLibraryDTO) => boolean;
  isInstallingFailedFc: (lib: PythonLibraryDTO) => boolean;
  isRequesting: boolean;
  postInstallationCheck: (arg: number) => void;
}

const NewLibraryName: FC<NewLibraryNameProps> = ({
  packageSource,
  channel,
  installCount,
  isInstallingFailedFc,
  isInstallingFc,
  setIsRequesting,
  isRequesting,
  postInstallationCheck,
}) => {
  const [libraryName, setLibraryName] = useState<string>('');
  const [libraryVersion, setLibraryVersion] = useState<string>('');
  const [libraryReturned, setLibraryReturned] = useState<
    PythonLibraryDTO | undefined
  >(undefined);
  const dispatch = useDispatch<Dispatch>();
  const { id: projectId, version } = useParams();

  const handleLibraryInstallNameSubmit = useCallback(() => {
    setIsRequesting(true);
    dispatch.pythonLibrary
      .installLibrary({
        id: +projectId,
        version,
        name: libraryName,
        data: {
          version: libraryVersion,
          library: libraryName,
          packageSource,
          channelUrl: channel,
        },
      })
      .then((data: PythonLibraryDTO) => {
        postInstallationCheck(installCount + 1);
        setLibraryReturned(data);

        dispatch.pythonLibrary
          .getLibrariesWithOperations({
            id: +projectId,
            version,
          })
          .then(() => {
            setIsRequesting(false);
          });
      })
      .catch((err: any) => {
        setIsRequesting(false);
        throw err;
      });
  }, [
    postInstallationCheck,
    setIsRequesting,
    version,
    dispatch.pythonLibrary,
    libraryName,
    libraryVersion,
    installCount,
    packageSource,
    projectId,
    channel,
  ]);

  // library returned, but it's not failed or ongoing = successful
  // small period of time where it has returned the library,
  // but not the operations so then reenables, not good
  useEffect(() => {
    if (libraryReturned) {
      if (
        !isInstallingFailedFc(libraryReturned) &&
        !isInstallingFc(libraryReturned)
      ) {
        dispatch.pythonLibrary.getLibrariesWithOperations({
          id: +projectId,
          version,
        });
      }
    }
  }, [
    dispatch.pythonLibrary,
    libraryReturned,
    isInstallingFailedFc,
    isInstallingFc,
    projectId,
    version,
  ]);

  return (
    <>
      <Flex width="100%" flexDirection="row" alignItems="center">
        <Flex flexDirection="column" width="calc(100% - 100px)">
          <Labeling bold mb="8px">
            Library name
          </Labeling>
          <Input
            placeholder="hops"
            width="100%"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setLibraryName(e.target.value);
            }}
          />
        </Flex>

        <Flex ml="8px" flexDirection="column" width="100px">
          <Flex flexDirection="row">
            <Labeling bold mb="8px">
              Version
            </Labeling>
            <Labeling gray ml="3px">
              optional
            </Labeling>
          </Flex>
          <Input
            width="100%"
            placeholder="1.0"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setLibraryVersion(e.target.value);
            }}
          />
        </Flex>
      </Flex>
      <Box display="flex" mt="20px">
        <Box display="flex" ml="auto">
          <Button
            ml="8px"
            disabled={isRequesting}
            onClick={handleLibraryInstallNameSubmit}
          >
            Install
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default memo(NewLibraryName);
