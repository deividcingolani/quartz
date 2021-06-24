// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Box, Flex } from 'rebass';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import {
  Button,
  Card,
  CardSecondary,
  Checkbox,
  FileLoader,
  Input,
  Popup,
  RadioGroup,
  Value,
} from '@logicalclocks/quartz';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  DynamicAllocation,
  JobFormData,
  JobsFormProps,
  RuleTypes,
  sourceFrom,
  StrongRuleTypes,
} from '../types';
import Loader from '../../../../components/loader/Loader';
import JobsStickySummary from './JobsStickySummary';
// Utils
import getInputValidation from '../../../../utils/getInputValidation';
import { name } from '../../../../utils/validators';
import icons from '../../../../sources/icons';
import FileExplorer from '../../../../components/file-explorer/fileExplorer';
import {
  FileExplorerMode,
  FileExplorerOptions,
  UploadFiles,
} from '../../../../components/file-explorer/types';
import FileUploader from '../../../../components/file-uploader/fileUploader';

const JobsForm: FC<JobsFormProps> = ({
  isDisabled,
  isLoading,
  isEdit = false,
  initialData,
  submitHandler,
}) => {
  const [type, setType] = useState(RuleTypes.SPARK);
  const [activeJobFile, setActiveJobFile] = useState<UploadFiles | null>(null);
  const [isOpenUploadExplorer, setIsOpenUploadExplorer] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [advancedConfiguration, setAdvancedConfiguration] = useState(false);
  const schema = yup.object().shape({
    appName: name.label('Name'),
    appPath: yup
      .string()
      .test(`${activeJobFile?.path}`, 'File is required', () => {
        return !!activeJobFile;
      }),
    'spark*executor*memory': yup
      .number()
      .notRequired()
      .test(
        'executorMemory',
        'Executor memory should not be less than 1024',
        (value: any) => {
          return (
            (!value && !advancedConfiguration) ||
            type !== RuleTypes.SPARK ||
            value >= 1024
          );
        },
      ),
  });

  const [additionalArchives, setAdditionalArchives] =
    useState<UploadFiles | null>(null);
  const [additionalJars, setAdditionalJars] = useState<UploadFiles | null>(
    null,
  );
  const [additionalPhyton, setAdditionalPhyton] = useState<UploadFiles | null>(
    null,
  );
  const [additionalFiles, setAdditionalFiles] = useState<UploadFiles | null>(
    null,
  );

  const [isViewUploadPath, setIsViewUploadPath] = useState(false);
  const [fileToBeUpload, setFileToBeUpload] = useState<any>({});
  const [isDisabledUploadButton, setIsDisabledUploadButton] = useState(false);
  const [isDisabledProjectButton, setIsDisabledProjectButton] = useState(false);

  const getAdditionalPathList = (additional: UploadFiles | null): string[] => {
    if (!!additional && additional.files.length > 0) {
      return additional.files.map((el: any) => `hdfs://${el.attributes.path}`);
    }
    return [''];
  };

  const handleDelete = () => {
    setIsDelete(false);
  };

  const [fileExplorerOptions, setFileExplorerOptions] = useState(
    FileExplorerOptions.app,
  );

  const changeExplorerOptions = (currentOptions: string) => {
    const option: any = currentOptions;
    setFileExplorerOptions(option);
  };

  const [isOpenExplorer, setIsOpenExplorer] = useState(false);

  const handleSelectFile = (activeFile: any, isDownload: boolean) => {
    switch (fileExplorerOptions) {
      case FileExplorerOptions.app:
        if (typeof activeFile !== 'string') {
          const newPath = activeFile.attributes.path.split('/');
          newPath.pop();
          setActiveJobFile((prevState: any) => ({
            ...prevState,
            name: activeFile.attributes.name,
            path: newPath.join('/'),
          }));
        } else {
          setActiveJobFile((prevState: any) => ({
            ...prevState,
            path: activeFile,
          }));
        }
        break;
      case FileExplorerOptions.archives: {
        if (typeof activeFile !== 'string') {
          setAdditionalArchives((prevState: any) => ({
            ...prevState,
            files: activeFile,
          }));
          break;
        } else {
          setAdditionalArchives((prevState: any) => {
            return {
              ...prevState,
              path: activeFile,
            };
          });
        }
        break;
      }
      case FileExplorerOptions.jars: {
        if (typeof activeFile !== 'string') {
          setAdditionalJars((prevState: any) => ({
            ...prevState,
            files: activeFile,
          }));
          break;
        } else {
          setAdditionalJars((prevState: any) => {
            return {
              ...prevState,
              path: activeFile,
            };
          });
        }
        break;
      }
      case FileExplorerOptions.phyton: {
        if (typeof activeFile !== 'string') {
          setAdditionalPhyton((prevState: any) => ({
            ...prevState,
            files: activeFile,
          }));
          break;
        } else {
          setAdditionalPhyton((prevState: any) => {
            return {
              ...prevState,
              path: activeFile,
            };
          });
        }
        break;
      }
      case FileExplorerOptions.files: {
        if (typeof activeFile !== 'string') {
          setAdditionalFiles((prevState: any) => ({
            ...prevState,
            files: activeFile,
          }));
          break;
        } else {
          setAdditionalFiles((prevState: any) => {
            return {
              ...prevState,
              path: activeFile,
            };
          });
        }
        break;
      }
      default:
      // Nothing to do
    }
    if (!isDownload) setIsOpenExplorer(false);
    setIsOpenUploadExplorer(false);
  };

  const helperForNewArr = (newFile: any, options: string) => {
    switch (options) {
      case 'isJobFile': {
        const newFiles = activeJobFile?.files;
        if (newFiles) newFiles.push(newFile);
        setActiveJobFile((prevState: any) => ({
          ...prevState,
          files: newFiles,
        }));
        break;
      }
      case 'isArchives': {
        const newFiles =
          !!additionalArchives?.files && additionalArchives?.files.length !== 0
            ? additionalArchives.files
            : [];
        newFiles.push(newFile);
        setAdditionalArchives((prevState: any) => ({
          ...prevState,
          files: newFiles,
        }));
        break;
      }
      case 'isJars': {
        const newFiles =
          !!additionalJars?.files && additionalJars?.files.length !== 0
            ? additionalJars.files
            : [];
        newFiles.push(newFile);
        setAdditionalJars((prevState: any) => ({
          ...prevState,
          files: newFiles,
        }));
        break;
      }
      case 'isPhyton': {
        const newFiles =
          !!additionalPhyton?.files && additionalPhyton?.files.length !== 0
            ? additionalPhyton.files
            : [];
        newFiles.push(newFile);
        setAdditionalPhyton((prevState: any) => ({
          ...prevState,
          files: newFiles,
        }));
        break;
      }
      case 'isFile': {
        const newFiles =
          !!additionalFiles?.files && additionalFiles?.files.length !== 0
            ? additionalFiles.files
            : [];
        newFiles.push(newFile);
        setAdditionalFiles((prevState: any) => ({
          ...prevState,
          files: newFiles,
        }));
        break;
      }
      default:
      // Nothing to do
    }
  };

  const helperForClose = (options: string) => {
    switch (options) {
      case 'isJobFile': {
        setActiveJobFile(null);
        break;
      }
      case 'isArchives': {
        setAdditionalArchives(null);
        break;
      }
      case 'isJars': {
        setAdditionalJars(null);
        break;
      }
      case 'isPhyton': {
        setAdditionalPhyton(null);
        break;
      }
      case 'isFile': {
        setAdditionalFiles(null);
        break;
      }
      default:
      // Nothing to do
    }
  };

  const methods = useForm({
    defaultValues: {
      type: 'sparkJobConfiguration',
      appName: initialData?.name,
      mainClass: 'io.hops.examples.featurestore_tour.Main',
      jobType: RuleTypes.SPARK,
      'spark*executor*instances': 1,
      'spark*executor*cores': 1,
      'spark*executor*memory': 2048,
      'spark*dynamicAllocation*minExecutors': 1,
      'spark*dynamicAllocation*maxExecutors': 1,
      amMemory: 2048,
      amVCores: 1,
      ...(!!initialData && {
        type: initialData.config.type,
        appName: initialData.config.appName,
        defaultArgs: initialData.config.defaultArgs,
        amMemory: +initialData.config.amMemory,
        amVCores: +initialData.config.amVCores,
        jobType:
          RuleTypes[initialData.config.jobType as keyof typeof RuleTypes],
        appPath: initialData.config.appPath,
        mainClass: initialData.config.mainClass,
        'spark*executor*instances':
          initialData.config['spark.executor.instances'],
        'spark*executor*cores': initialData.config['spark.executor.cores'],
        'spark*executor*memory': +initialData.config['spark.executor.memory'],
        'spark*yarn*dist*pyFiles':
          initialData.config['spark.yarn.dist.pyFiles'],
        'spark*yarn*dist*jars': initialData.config['spark.yarn.dist.jars'],
        'spark*yarn*dist*files': initialData.config['spark.yarn.dist.files'],
        'spark*yarn*dist*archives':
          initialData.config['spark.yarn.dist.archives'],
        dynamicAllocation: initialData.config['spark.dynamicAllocation.enabled']
          ? 'Dynamic'
          : 'Static',
        'spark*dynamicAllocation*minExecutors':
          initialData.config['spark.dynamicAllocation.minExecutors'],
        'spark*dynamicAllocation*maxExecutors':
          initialData.config['spark.dynamicAllocation.maxExecutors'],
      }),
    },

    shouldUnregister: true,
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    mode: 'onChange',
  });

  const [sourceFromExistingJob, setSourceFromExistingJob] = useState(
    sourceFrom.scratch,
  );

  const {
    watch,
    errors,
    control,
    register,
    setError,
    clearErrors,
    handleSubmit,
    reset,
  } = methods;

  const dynamicAllocation = watch(
    'dynamicAllocation',
    DynamicAllocation.DYNAMIC,
  );
  const jobType = watch('jobType');

  useEffect(() => {
    if (activeJobFile) {
      clearErrors('appPath');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeJobFile]);

  const handleSelectSource = (value: string) => {
    setSourceFromExistingJob(value);
  };

  const errorsLength = Object.keys(errors).length;

  let errorsValue = '';
  if (errorsLength > 0) {
    errorsValue =
      errorsLength === 1
        ? `${errorsLength.toString()} error`
        : `${errorsLength.toString()} errors`;
  }

  const [fileExplorerMode, setFileExplorerMode] = useState(
    FileExplorerMode.oneFile,
  );

  const additional = useCallback(() => {
    return {
      archives: getAdditionalPathList(additionalArchives),
      jars: getAdditionalPathList(additionalJars),
      phyton: getAdditionalPathList(additionalPhyton),
      files: getAdditionalPathList(additionalFiles),
    };
  }, [additionalArchives, additionalJars, additionalPhyton, additionalFiles]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSubmit = useCallback(
    handleSubmit(async (data: JobFormData) => {
      const test = additional();
      submitHandler(data, activeJobFile, test);
    }),
    [setError, clearErrors, submitHandler, activeJobFile, additional],
  );

  const handleCloseExplorer = () => {
    setIsOpenUploadExplorer(false);
    setIsOpenExplorer(false);
    setIsOpenUploadExplorer(false);
    setIsViewUploadPath(false);
    setFileToBeUpload({});
    setIsDisabledUploadButton(false);
  };

  useEffect(() => {
    if (activeJobFile) {
      setIsDisabledProjectButton(true);
      setIsDisabledUploadButton(true);
    } else {
      setIsDisabledProjectButton(false);
      setIsDisabledUploadButton(false);
    }
  }, [activeJobFile]);

  const handleSetAdvConfigurations = () => {
    setAdvancedConfiguration(!advancedConfiguration);
  };

  return (
    <FormProvider {...methods}>
      <Card
        title={!isEdit ? 'Create new job' : 'Edit job'}
        contentProps={{ pb: 20 }}
        height="100%"
      >
        <Flex flexDirection="column">
          {!isEdit && (
            <Flex>
              <RadioGroup
                mr="8px"
                flexDirection="row"
                value={sourceFromExistingJob}
                options={[sourceFrom.scratch, sourceFrom.existingJob]}
                onChange={(value) => handleSelectSource(value)}
              />
            </Flex>
          )}
          {sourceFromExistingJob === sourceFrom.existingJob && (
            <Flex mt="20px" width="400px" flexWrap="wrap">
              <FileUploader
                key={1}
                options="isJobFile"
                handleSelectFolder={handleSelectFile}
                setFileExplorerMode={setFileExplorerMode}
                activeApp={activeJobFile}
                fileExplorerMode={fileExplorerMode}
                fileExplorerOptions={FileExplorerOptions.app}
                isDisabledUploadButton={isDisabledUploadButton}
                changeExplorerOptions={changeExplorerOptions}
                handleCloseExplorer={handleCloseExplorer}
                helperForNewArr={helperForNewArr}
                isViewUploadPath={isViewUploadPath}
                setIsViewUploadPath={setIsViewUploadPath}
                fileToBeUpload={fileToBeUpload}
                setFileToBeUpload={setFileToBeUpload}
                setActiveApp={setActiveJobFile}
                isDelete={isDelete}
                setIsDelete={setIsDelete}
                isOpenUploadExplorer={isOpenUploadExplorer}
                setIsOpenUploadExplorer={setIsOpenUploadExplorer}
              />
            </Flex>
          )}
          <Flex flexDirection="column" mt={isEdit ? '0px' : '20px'}>
            <Value>File</Value>
            <Flex mt="8px" mb="20px">
              {isOpenExplorer && (
                <Popup
                  left="40px"
                  right="40px"
                  top="20px"
                  bottom="20px"
                  isOpen={isOpenExplorer}
                  onClose={() => handleCloseExplorer()}
                >
                  <FileExplorer
                    handleCloseExplorer={handleCloseExplorer}
                    handleSelectFile={handleSelectFile}
                    mode={fileExplorerMode}
                    activeFile={activeJobFile}
                  />
                </Popup>
              )}
              <Flex flexDirection="column">
                <Flex width="400px" flexWrap="wrap">
                  <Button
                    intent="secondary"
                    mr="8px"
                    disabled={isDisabledProjectButton}
                    onClick={() => {
                      setFileExplorerOptions(FileExplorerOptions.app);
                      setFileExplorerMode(FileExplorerMode.oneFile);
                      setIsOpenExplorer(true);
                      setFileToBeUpload({});
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
                    options="isJobFile"
                    handleSelectFolder={handleSelectFile}
                    changeExplorerOptions={changeExplorerOptions}
                    handleCloseExplorer={handleCloseExplorer}
                    helperForNewArr={helperForNewArr}
                    setFileExplorerMode={setFileExplorerMode}
                    activeApp={activeJobFile}
                    fileExplorerMode={fileExplorerMode}
                    fileExplorerOptions={FileExplorerOptions.app}
                    isDisabledUploadButton={isDisabledUploadButton}
                    isViewUploadPath={isViewUploadPath}
                    setIsViewUploadPath={setIsViewUploadPath}
                    fileToBeUpload={fileToBeUpload}
                    setFileToBeUpload={setFileToBeUpload}
                    setActiveApp={setActiveJobFile}
                    isDelete={isDelete}
                    setIsDelete={setIsDelete}
                    isOpenUploadExplorer={isOpenUploadExplorer}
                    setIsOpenUploadExplorer={setIsOpenUploadExplorer}
                  />
                </Flex>
                <Input
                  {...getInputValidation('appPath', errors)}
                  sx={{
                    display: 'none',
                  }}
                />
                {!!activeJobFile && (
                  <Box mt="20px">
                    <FileLoader
                      removeHandler={() => helperForClose('isJobFile')}
                      isLoading={!activeJobFile}
                      fileName={
                        !activeJobFile.name
                          ? fileToBeUpload.name
                          : activeJobFile.name
                      }
                      located={activeJobFile.path}
                    >
                      located in
                    </FileLoader>
                  </Box>
                )}
              </Flex>
            </Flex>
          </Flex>
          <Flex flexDirection="column">
            <Input
              name="appName"
              ref={register}
              readOnly={isEdit}
              placeholder="name"
              label="Name"
              labelProps={{ width: '180px', mb: '20px' }}
              {...getInputValidation('appName', errors)}
            />
            <Input
              name="defaultArgs"
              ref={register}
              optional
              placeholder="args"
              label="Default arguments"
              labelProps={{ width: '100%' }}
              disabled={isLoading}
            />
          </Flex>
        </Flex>
      </Card>
      <CardSecondary
        mt="20px"
        mb="100px"
        title="Advanced configuration"
        sx={{ width: '100%' }}
      >
        <Flex flexDirection="column">
          {isEdit && jobType && (
            <Controller
              control={control}
              name="jobType"
              defaultValue={
                StrongRuleTypes[jobType as keyof typeof StrongRuleTypes]
              }
              render={({ onChange, value }) => (
                <RadioGroup
                  flexDirection="row"
                  mr="30px"
                  value={value}
                  options={[
                    RuleTypes.SPARK,
                    RuleTypes.PYSPARK,
                    RuleTypes.FLINK,
                  ]}
                  onChange={(value) => {
                    if (!isEdit) {
                      reset();
                    }
                    return onChange(value);
                  }}
                />
              )}
            />
          )}
          {!isEdit && (
            <Controller
              control={control}
              name="jobType"
              defaultValue={RuleTypes.SPARK}
              render={({ onChange, value }) => (
                <RadioGroup
                  flexDirection="row"
                  mr="30px"
                  value={value}
                  options={[
                    RuleTypes.SPARK,
                    RuleTypes.PYSPARK,
                    RuleTypes.FLINK,
                  ]}
                  onChange={(value) => {
                    setType(
                      RuleTypes[
                        StrongRuleTypes[value as keyof typeof StrongRuleTypes]
                      ],
                    );
                    return onChange(value);
                  }}
                />
              )}
            />
          )}
          <Box my="20px">
            <Checkbox
              checked={advancedConfiguration}
              label="Advanced configuration"
              onChange={handleSetAdvConfigurations}
            />
          </Box>
          {advancedConfiguration &&
            (jobType === RuleTypes.FLINK || jobType === RuleTypes.PYSPARK) && (
              <Flex flexDirection="column">
                <Flex
                  sx={{
                    mb: '20px',
                  }}
                >
                  <Input
                    name="amMemory"
                    ref={register({
                      setValueAs: (value) => (value ? parseInt(value, 10) : ''),
                    })}
                    placeholder=""
                    label="Memory (MB)"
                    labelProps={{ width: '190px', mr: '20px' }}
                    disabled={isLoading}
                  />
                </Flex>
                <Flex
                  sx={{
                    mb: '20px',
                  }}
                >
                  <Input
                    name="amVCores"
                    ref={register({
                      setValueAs: (value) => (value ? parseInt(value, 10) : ''),
                    })}
                    placeholder=""
                    label="Driver virtual cores"
                    labelProps={{ width: '190px' }}
                    disabled={isLoading}
                  />
                </Flex>
              </Flex>
            )}
          {advancedConfiguration && jobType === RuleTypes.SPARK && (
            <Flex flexDirection="column">
              <Flex
                sx={{
                  mb: '20px',
                }}
              >
                <Input
                  name="amMemory"
                  ref={register({
                    setValueAs: (value) => (value ? parseInt(value, 10) : 2048),
                  })}
                  placeholder=""
                  label="Driver  memory (MB)"
                  labelProps={{ width: '190px', mr: '20px' }}
                  disabled={isLoading}
                />
                <Input
                  name="amVCores"
                  ref={register({
                    setValueAs: (value) => (value ? parseInt(value, 10) : 1),
                  })}
                  placeholder=""
                  label="Driver virtual cores"
                  labelProps={{ width: '190px' }}
                  disabled={isLoading}
                />
              </Flex>
              <Flex
                sx={{
                  mb: '20px',
                }}
              >
                <Input
                  name="spark*executor*memory"
                  ref={register({
                    required: false,
                    setValueAs: (value) => (value ? parseInt(value, 10) : 2048),
                  })}
                  placeholder=""
                  label="Executor  memory (MB)"
                  labelProps={{ width: '190px', mr: '20px' }}
                  disabled={isLoading}
                  {...getInputValidation('spark*executor*memory', errors)}
                />
                <Input
                  name="spark*executor*cores"
                  ref={register({
                    setValueAs: (value) => (value ? parseInt(value, 10) : 1),
                  })}
                  placeholder=""
                  label="Executor virtual cores"
                  labelProps={{ width: '190px' }}
                  disabled={isLoading}
                />
              </Flex>
              <Flex>
                <Controller
                  control={control}
                  name="dynamicAllocation"
                  defaultValue={DynamicAllocation.DYNAMIC}
                  render={({ onChange, value }) => (
                    <RadioGroup
                      flexDirection="row"
                      mr="30px"
                      value={value}
                      options={[
                        DynamicAllocation.DYNAMIC,
                        DynamicAllocation.STATIC,
                      ]}
                      onChange={(value) => onChange(value)}
                    />
                  )}
                />
              </Flex>
              {dynamicAllocation === DynamicAllocation.DYNAMIC ? (
                <Flex
                  sx={{
                    my: '20px',
                  }}
                >
                  <Input
                    name="spark*dynamicAllocation*minExecutors"
                    ref={register({
                      setValueAs: (value) => (value ? parseInt(value, 10) : 1),
                    })}
                    placeholder=""
                    label="Min executors"
                    labelProps={{ width: '190px', mr: '20px' }}
                    disabled={isLoading}
                  />
                  <Input
                    name="spark*dynamicAllocation*maxExecutors"
                    ref={register({
                      setValueAs: (value) => (value ? parseInt(value, 10) : 1),
                    })}
                    placeholder=""
                    label="Max executors"
                    labelProps={{ width: '190px' }}
                    disabled={isLoading}
                  />
                </Flex>
              ) : (
                <Input
                  name="spark*executor*instances"
                  ref={register({
                    setValueAs: (value) => (value ? parseInt(value, 10) : 1),
                  })}
                  placeholder=""
                  label="Number of executors"
                  labelProps={{ width: '190px', my: '20px' }}
                  disabled={isLoading}
                />
              )}
            </Flex>
          )}
          {advancedConfiguration &&
            (jobType === RuleTypes.SPARK || jobType === RuleTypes.FLINK) && (
              <>
                <Flex flexDirection="column">
                  <Value>Additional archives</Value>
                  <Flex mt="8px">
                    <Button
                      intent="secondary"
                      mr="8px"
                      onClick={() => {
                        setFileExplorerOptions(FileExplorerOptions.archives);
                        setFileExplorerMode(FileExplorerMode.nFiles);
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
                      key={3}
                      fromFile
                      options="isArchives"
                      handleSelectFolder={handleSelectFile}
                      changeExplorerOptions={changeExplorerOptions}
                      handleCloseExplorer={handleCloseExplorer}
                      helperForNewArr={helperForNewArr}
                      handleDelete={handleDelete}
                      setFileExplorerMode={setFileExplorerMode}
                      activeApp={additionalArchives}
                      fileExplorerMode={FileExplorerMode.oneFolder}
                      fileExplorerOptions={FileExplorerOptions.archives}
                      isOpenExplorer={isOpenExplorer}
                      setIsOpenExplorer={setIsOpenExplorer}
                      fileToBeUpload={fileToBeUpload}
                      setFileToBeUpload={setFileToBeUpload}
                      setActiveApp={setAdditionalArchives}
                      additionalArchives={additionalArchives}
                      isDelete={isDelete}
                      setIsDelete={setIsDelete}
                      isOpenUploadExplorer={isOpenUploadExplorer}
                      setIsOpenUploadExplorer={setIsOpenUploadExplorer}
                    />
                  </Flex>
                  {!!additionalArchives &&
                    !!additionalArchives.files &&
                    additionalArchives.files.map((el: any) => {
                      return (
                        <Box mt="20px" key={el.attributes.id}>
                          <FileLoader
                            removeHandler={() => {
                              setIsDelete(true);
                              const newArr = additionalArchives.files.filter(
                                (item: any) =>
                                  el.attributes.id !== item.attributes.id,
                              );
                              setAdditionalArchives((prevState: any) => ({
                                ...prevState,
                                files: newArr,
                              }));
                            }}
                            isLoading={!additionalArchives}
                            fileName={el.attributes.name}
                            located={
                              additionalArchives.path
                                ? additionalArchives.path
                                : el.attributes.path
                                    .split('/')
                                    .slice(
                                      0,
                                      el.attributes.path.split('/').length - 1,
                                    )
                                    .join('/')
                            }
                          >
                            located in
                          </FileLoader>
                        </Box>
                      );
                    })}
                </Flex>
                <Flex flexDirection="column" mt="20px">
                  <Value>No additional jars</Value>
                  <Flex mt="8px">
                    <Button
                      intent="secondary"
                      mr="8px"
                      onClick={() => {
                        setFileExplorerOptions(FileExplorerOptions.jars);
                        setFileExplorerMode(FileExplorerMode.nFiles);
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
                      key={4}
                      fromFile
                      options="isJars"
                      handleSelectFolder={handleSelectFile}
                      changeExplorerOptions={changeExplorerOptions}
                      handleCloseExplorer={handleCloseExplorer}
                      helperForNewArr={helperForNewArr}
                      handleDelete={handleDelete}
                      setFileExplorerMode={setFileExplorerMode}
                      activeApp={additionalJars}
                      fileExplorerMode={FileExplorerMode.oneFolder}
                      fileExplorerOptions={FileExplorerOptions.jars}
                      isOpenExplorer={isOpenExplorer}
                      setIsOpenExplorer={setIsOpenExplorer}
                      fileToBeUpload={fileToBeUpload}
                      setFileToBeUpload={setFileToBeUpload}
                      setActiveApp={setAdditionalJars}
                      additionalJars={additionalJars}
                      isDelete={isDelete}
                      setIsDelete={setIsDelete}
                      isOpenUploadExplorer={isOpenUploadExplorer}
                      setIsOpenUploadExplorer={setIsOpenUploadExplorer}
                    />
                  </Flex>
                  {!!additionalJars &&
                    !!additionalJars.files &&
                    additionalJars.files.map((el: any) => {
                      return (
                        <Box mt="20px">
                          <FileLoader
                            removeHandler={() => {
                              setIsDelete(true);
                              const newArr = additionalJars.files.filter(
                                (item: any) =>
                                  el.attributes.id !== item.attributes.id,
                              );
                              setAdditionalJars((prevState: any) => ({
                                ...prevState,
                                files: newArr,
                              }));
                            }}
                            isLoading={!el}
                            fileName={el.attributes.name}
                            located={
                              additionalJars.path
                                ? additionalJars.path
                                : el.attributes.path
                                    .split('/')
                                    .slice(
                                      0,
                                      el.attributes.path.split('/').length - 1,
                                    )
                                    .join('/')
                            }
                          >
                            located in
                          </FileLoader>
                        </Box>
                      );
                    })}
                </Flex>
                <Flex flexDirection="column" mt="20px">
                  <Value>No additional python dependencies</Value>
                  <Flex mt="8px">
                    <Button
                      intent="secondary"
                      mr="8px"
                      onClick={() => {
                        setFileExplorerOptions(FileExplorerOptions.phyton);
                        setFileExplorerMode(FileExplorerMode.nFiles);
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
                      key={5}
                      fromFile
                      options="isPhyton"
                      handleSelectFolder={handleSelectFile}
                      changeExplorerOptions={changeExplorerOptions}
                      handleCloseExplorer={handleCloseExplorer}
                      helperForNewArr={helperForNewArr}
                      handleDelete={handleDelete}
                      setFileExplorerMode={setFileExplorerMode}
                      activeApp={additionalPhyton}
                      fileExplorerMode={FileExplorerMode.oneFolder}
                      fileExplorerOptions={FileExplorerOptions.phyton}
                      isOpenExplorer={isOpenExplorer}
                      setIsOpenExplorer={setIsOpenExplorer}
                      fileToBeUpload={fileToBeUpload}
                      setFileToBeUpload={setFileToBeUpload}
                      setActiveApp={setAdditionalPhyton}
                      additionalArchives={additionalPhyton}
                      isDelete={isDelete}
                      setIsDelete={setIsDelete}
                      isOpenUploadExplorer={isOpenUploadExplorer}
                      setIsOpenUploadExplorer={setIsOpenUploadExplorer}
                    />
                  </Flex>
                  {!!additionalPhyton &&
                    !!additionalPhyton.files &&
                    additionalPhyton.files.map((el: any) => {
                      return (
                        <Box mt="20px">
                          <FileLoader
                            removeHandler={() => {
                              setIsDelete(true);
                              const newArr = additionalPhyton.files.filter(
                                (item: any) =>
                                  el.attributes.id !== item.attributes.id,
                              );
                              setAdditionalPhyton((prevState: any) => ({
                                ...prevState,
                                files: newArr,
                              }));
                            }}
                            isLoading={!additionalPhyton}
                            fileName={el.attributes.name}
                            located={
                              additionalPhyton.path
                                ? additionalPhyton.path
                                : el.attributes.path
                                    .split('/')
                                    .slice(
                                      0,
                                      el.attributes.path.split('/').length - 1,
                                    )
                                    .join('/')
                            }
                          >
                            located in
                          </FileLoader>
                        </Box>
                      );
                    })}
                </Flex>
                <Flex flexDirection="column" my="20px">
                  <Value>No additional files</Value>
                  <Flex mt="8px">
                    <Button
                      intent="secondary"
                      mr="8px"
                      onClick={() => {
                        setFileExplorerOptions(FileExplorerOptions.files);
                        setFileExplorerMode(FileExplorerMode.nFiles);
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
                      key={6}
                      fromFile
                      options="isFile"
                      handleSelectFolder={handleSelectFile}
                      changeExplorerOptions={changeExplorerOptions}
                      handleCloseExplorer={handleCloseExplorer}
                      helperForNewArr={helperForNewArr}
                      handleDelete={handleDelete}
                      setFileExplorerMode={setFileExplorerMode}
                      activeApp={additionalFiles}
                      fileExplorerMode={FileExplorerMode.oneFolder}
                      fileExplorerOptions={FileExplorerOptions.files}
                      isOpenExplorer={isOpenExplorer}
                      setIsOpenExplorer={setIsOpenExplorer}
                      fileToBeUpload={fileToBeUpload}
                      setFileToBeUpload={setFileToBeUpload}
                      setActiveApp={setAdditionalFiles}
                      additionalArchives={additionalFiles}
                      isDelete={isDelete}
                      setIsDelete={setIsDelete}
                      isOpenUploadExplorer={isOpenUploadExplorer}
                      setIsOpenUploadExplorer={setIsOpenUploadExplorer}
                    />
                  </Flex>
                  {!!additionalFiles &&
                    !!additionalFiles.files &&
                    additionalFiles.files.map((el: any) => {
                      return (
                        <Box mt="20px">
                          <FileLoader
                            removeHandler={() => {
                              setIsDelete(true);
                              const newArr = additionalFiles.files.filter(
                                (item: any) =>
                                  el.attributes.id !== item.attributes.id,
                              );
                              setAdditionalFiles((prevState: any) => ({
                                ...prevState,
                                files: newArr,
                              }));
                            }}
                            isLoading={!additionalFiles}
                            fileName={el.attributes.name}
                            located={
                              additionalFiles.path
                                ? additionalFiles.path
                                : el.attributes.path
                                    .split('/')
                                    .slice(
                                      0,
                                      el.attributes.path.split('/').length - 1,
                                    )
                                    .join('/')
                            }
                          >
                            located in
                          </FileLoader>
                        </Box>
                      );
                    })}
                </Flex>
              </>
            )}
          <Controller
            control={control}
            name="localResources"
            render={({ onChange, value }) => (
              <Input
                name="properties"
                type="textarea"
                placeholder="enter properties and values"
                label="Properties"
                sx={{
                  width: '100%',
                  borderWidth: 0,
                  p: '8px',
                  fontFamily: 'Inter',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: '12px',
                }}
                labelProps={{ width: '100%' }}
                disabled={isLoading}
                value={value}
                onChange={(value: any) => onChange(value)}
              />
            )}
          />
        </Flex>
      </CardSecondary>
      {isLoading && <Loader />}
      <JobsStickySummary
        errorsValue={errorsValue}
        isEdit={isEdit}
        onSubmit={onSubmit}
        disabled={isLoading || isDisabled}
      />
    </FormProvider>
  );
};

export default JobsForm;
