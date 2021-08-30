import { Box, Flex } from 'rebass';
// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import {
  Button,
  Input,
  Labeling,
  Popup,
  FileLoader,
} from '@logicalclocks/quartz';
import * as yup from 'yup';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import FileExplorer from '../../../../../components/file-explorer/fileExplorer';
import {
  FileExplorerMode,
  FileExplorerOptions,
  UploadFiles,
} from '../../../../../components/file-explorer/types';
import icons from '../../../../../sources/icons';
import FileUploader from '../../../../../components/file-uploader/fileUploader';
import getInputValidation from '../../../../../utils/getInputValidation';
import { Dispatch } from '../../../../../store';

interface NewLibraryFileProps {
  setIsOpenExplorerFromPopup: (arg: boolean) => void;
  channelUrl: string;
  packageSource: string;
  setChannelAndPackage?: (arg: string) => [string, string];
  fileNamePattern: RegExp;
  setIsRequesting: (arg: boolean) => void;
  isRequesting: boolean;
  label: string;
  postInstallationCheck: (arg: number) => void;
}

const NewLibraryFile: FC<NewLibraryFileProps> = ({
  setIsOpenExplorerFromPopup,
  channelUrl,
  packageSource,
  setChannelAndPackage,
  fileNamePattern,
  setIsRequesting,
  isRequesting,
  label,
  postInstallationCheck,
}) => {
  // Whether a file has already been picked (used to disable others, unless deleting it)
  const [activeFile, setActiveFile] = useState<UploadFiles | null>(null);
  // First picker
  const [isOpenExplorer, setIsOpenExplorer] = useState(false);
  const [isDisabledUploadButton, setIsDisabledUploadButton] = useState(false);
  const [isDisabledProjectButton, setIsDisabledProjectButton] = useState(false);
  const [fileExplorerMode, setFileExplorerMode] = useState(
    FileExplorerMode.oneFile,
  );

  const [_, setFileExplorerOptions] = useState(FileExplorerOptions.app);

  const schema = yup.object().shape({
    filePath: yup
      .string()
      .test(`${activeFile}`, 'File is required', () => {
        return !!activeFile;
      })
      .trim()
      .matches(fileNamePattern, 'Wrong extension'),
  });

  const methods = useForm({
    defaultValues: {
      ...{
        filePath: '',
      },
    },
    resolver: yupResolver(schema),
  });

  const { errors, handleSubmit, clearErrors } = methods;

  const dispatch = useDispatch<Dispatch>();
  const { id: projectId, version } = useParams();

  useEffect(() => {
    if (activeFile) {
      setIsDisabledProjectButton(true);
      setIsDisabledUploadButton(true);
    } else {
      setIsDisabledProjectButton(false);
      setIsDisabledUploadButton(false);
    }
  }, [activeFile]);

  useEffect(() => {
    if (activeFile) {
      // TODO also disabled is !isPopupOpen originally
      clearErrors('filePath');
    }
  }, [clearErrors, activeFile]);

  const handleCloseExplorer = () => {
    setIsOpenExplorerFromPopup(false);
    setIsOpenExplorer(false);
  };

  const handleSelectExplorerFile = (activeFile: any) => {
    setActiveFile((prevState: any) => ({
      ...prevState,
      name: activeFile.attributes.name,
      path: activeFile.attributes.path,
      extension: activeFile.attributes.name.split('.').pop(),
    }));

    handleCloseExplorer();
  };

  const helperForNewArr = useCallback(
    (newFile: any) => {
      setActiveFile(newFile);
    },
    [setActiveFile],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleCreate = useCallback(
    handleSubmit(async () => {
      if (!activeFile) {
        return;
      }
      const fileName = activeFile.name;
      const filePath = activeFile.path;

      const [channelUrlFinal, packageSourceFinal] = setChannelAndPackage
        ? setChannelAndPackage(fileName)
        : [channelUrl, packageSource];

      setIsRequesting(true);
      dispatch.pythonLibrary
        .installLibrary({
          id: +projectId,
          version,
          name: fileName,
          data: {
            library: fileName,
            dependencyUrl: filePath,
            channelUrl: channelUrlFinal,
            packageSource: packageSourceFinal,
          },
        })
        .then(() => {
          postInstallationCheck(1000);
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
    }),
    [
      setIsRequesting,
      handleSubmit,
      channelUrl,
      dispatch.pythonLibrary,
      packageSource,
      activeFile,
      setChannelAndPackage,
      projectId,
      version,
    ],
  );

  return (
    <Flex flexDirection="column">
      <Labeling bold mb="8px">
        {label}
      </Labeling>
      <Flex mb="20px">
        <FormProvider {...methods}>
          {
            // From Project popup
            isOpenExplorer && (
              <Box
                sx={{
                  zIndex: 33,
                }}
              >
                <Popup
                  left="40px"
                  right="40px"
                  top="20px"
                  bottom="20px"
                  isOpen={isOpenExplorer}
                  onClose={() => setIsOpenExplorer(!isOpenExplorer)}
                >
                  <FileExplorer
                    handleCloseExplorer={handleCloseExplorer}
                    handleSelectFile={handleSelectExplorerFile}
                    mode={fileExplorerMode}
                    activeFile={activeFile}
                  />
                </Popup>
              </Box>
            )
          }

          <Flex flexDirection="column">
            <Flex width="400px" flexWrap="wrap">
              <Button
                intent="secondary"
                mr="8px"
                disabled={isDisabledProjectButton}
                onClick={() => {
                  setFileExplorerOptions(FileExplorerOptions.app);
                  setFileExplorerMode(FileExplorerMode.oneFile);
                  setIsOpenExplorerFromPopup(true);
                  setIsOpenExplorer(true);
                }}
              >
                <Box
                  sx={{
                    height: '16px',
                    overflow: 'hidden',
                    display: 'inline-block',
                    svg: {
                      mr: '9px',
                      path: {
                        fill: 'primary',
                      },
                    },
                  }}
                >
                  {icons.folder}
                </Box>
                From project
              </Button>

              <FileUploader
                key={2}
                fromFile
                isEdit
                options="isFile"
                setFileExplorerMode={setFileExplorerMode}
                isDisabledUploadButton={isDisabledUploadButton}
                helperForNewArr={helperForNewArr}
                fileExplorerMode={fileExplorerMode}
                fileExplorerOptions={FileExplorerOptions.app}
                setIsOpenExplorerFromPopup={setIsOpenExplorerFromPopup}
              />
            </Flex>

            <Input
              {...getInputValidation('filePath', errors)}
              sx={{
                display: 'none',
              }}
            />

            {
              // Showing the file that was uploaded/picked
              !!activeFile && (
                <Box mt="20px">
                  <FileLoader
                    id={activeFile.id}
                    removeHandler={() => {
                      setActiveFile(null);
                    }}
                    isLoading={!activeFile}
                    fileName={activeFile.name}
                    located={activeFile.path
                      .split('/')
                      .slice(0, activeFile.path.split('/').length - 1)
                      .join('/')}
                  >
                    located in
                  </FileLoader>
                </Box>
              )
            }
          </Flex>
        </FormProvider>
      </Flex>

      <Box display="flex" ml="auto">
        <Button ml="8px" onClick={handleCreate} disabled={isRequesting}>
          Run installation
        </Button>
      </Box>
    </Flex>
  );
};

export default memo(NewLibraryFile);
