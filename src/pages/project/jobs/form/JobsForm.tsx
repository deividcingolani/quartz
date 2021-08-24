// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Flex } from 'rebass';
import { FormProvider, useForm } from 'react-hook-form';
import {
  Button,
  Card,
  FileLoader,
  Input,
  Popup,
  RadioGroup,
  Value,
  CardSecondary,
  Callout,
  CalloutTypes,
} from '@logicalclocks/quartz';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FormProps, sourceFrom, FormType } from '../types';
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
import { FrameworkType, Jobs, JobsConfig } from '../../../../types/jobs';
import FileUploader from '../../../../components/file-uploader/fileUploader';
import {
  addDependencies,
  addMainClass,
  filterFields,
  flatData,
} from '../utils/jobFormHelpers';
import AdvancedConfig from './AdvancedConfig';
import { JupyterSettings } from '../../../../types/jupiter';

const JobsForm: FC<FormProps<Jobs | JupyterSettings>> = ({
  // Fix this any
  formType = FormType.JOB,
  isDisabled,
  isLoading,
  isEdit = false,
  initialData,
  submitHandler,
  onDelete,
  canSave = true,
}) => {
  const [type, setType] = useState(FrameworkType.SPARK);
  const [activeJobFile, setActiveJobFile] = useState<UploadFiles | null>(null);

  const isJobs = formType === FormType.JOB;
  const isJupyter = formType === FormType.JUPYTER;

  const schema = yup.object().shape({
    ...(isJobs && {
      appName: name.label('Name'),
      appPath: yup
        .string()
        .test(`${activeJobFile?.path}`, 'File is required', () => {
          return !!activeJobFile;
        }),
    }),
  });

  // Homogenize jobs and jupyter initial data.
  const preparedInitial = useMemo(() => {
    if (initialData?.config) {
      return initialData;
    }
    return initialData?.jobConfig
      ? { ...initialData, config: initialData.jobConfig, jobConfig: null }
      : null;
  }, [initialData]);

  const [additionalArchives, setAdditionalArchives] = useState<
    UploadFiles[] | null
  >(null);
  const [additionalJars, setAdditionalJars] = useState<UploadFiles[] | null>(
    null,
  );
  const [additionalPython, setAdditionalPython] = useState<
    UploadFiles[] | null
  >(null);
  const [additionalFiles, setAdditionalFiles] = useState<UploadFiles[] | null>(
    null,
  );

  const [isDisabledUploadButton, setIsDisabledUploadButton] = useState(false);
  const [isDisabledProjectButton, setIsDisabledProjectButton] = useState(false);

  const [fileExplorerOptions, setFileExplorerOptions] = useState(
    FileExplorerOptions.app,
  );

  const [isOpenExplorer, setIsOpenExplorer] = useState(false);

  const handleSelectFile = (activeFile: any, isDownload: boolean) => {
    switch (fileExplorerOptions) {
      case FileExplorerOptions.app:
        setActiveJobFile((prevState: any) => ({
          ...prevState,
          name: activeFile.attributes.name,
          path: activeFile.attributes.path,
          extension: activeFile.attributes.name.split('.').pop(),
        }));
        break;
      // all the additional options are configured in multifile mode
      // so activeFile is actually an array of activeFiles
      case FileExplorerOptions.archives: {
        setAdditionalArchives((prevState: any) => [
          ...(prevState || []),
          ...(activeFile as any[]).map((f) => ({
            id: f.attributes.id,
            name: f.attributes.name,
            path: f.attributes.path,
          })),
        ]);
        break;
      }
      case FileExplorerOptions.jars: {
        setAdditionalJars((prevState: any) => [
          ...(prevState || []),
          ...(activeFile as any[]).map((f) => ({
            id: f.attributes.id,
            name: f.attributes.name,
            path: f.attributes.path,
          })),
        ]);
        break;
      }
      case FileExplorerOptions.python: {
        setAdditionalPython((prevState: any) => [
          ...(prevState || []),
          ...(activeFile as any[]).map((f) => ({
            id: f.attributes.id,
            name: f.attributes.name,
            path: f.attributes.path,
          })),
        ]);
        break;
      }
      case FileExplorerOptions.files: {
        setAdditionalFiles((prevState: any) => [
          ...(prevState || []),
          ...(activeFile as any[]).map((f) => ({
            id: f.attributes.id,
            name: f.attributes.name,
            path: f.attributes.path,
          })),
        ]);
        break;
      }
      default:
      // Nothing to do
    }
    if (!isDownload) setIsOpenExplorer(false);
  };

  const fileExists = (newFile: any, existingFiles: any[]) => {
    return existingFiles.some(
      (exFile) => exFile.path === newFile.path && exFile.name === newFile.name,
    );
  };

  const helperForNewArr = (newFile: any, options: string) => {
    switch (options) {
      case 'isJobFile': {
        setActiveJobFile(newFile);
        break;
      }
      case 'isArchives': {
        if (!fileExists(newFile, additionalArchives || [])) {
          setAdditionalArchives((prevState: any) => [
            ...(prevState || []),
            newFile,
          ]);
        }
        break;
      }
      case 'isJars': {
        if (!fileExists(newFile, additionalJars || [])) {
          setAdditionalJars((prevState: any) => [
            ...(prevState || []),
            newFile,
          ]);
        }
        break;
      }
      case 'isPython': {
        if (!fileExists(newFile, additionalPython || [])) {
          setAdditionalPython((prevState: any) => [
            ...(prevState || []),
            newFile,
          ]);
        }
        break;
      }
      case 'isFile': {
        if (!fileExists(newFile, additionalFiles || [])) {
          setAdditionalFiles((prevState: any) => [
            ...(prevState || []),
            newFile,
          ]);
        }
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
      case 'isPython': {
        setAdditionalPython(null);
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

  const handleInitialFile = (path: string, options: string) => {
    const pathSplits = path.split('/');
    const fileName = pathSplits.pop();
    helperForNewArr(
      {
        // for files coming from the JobConfig we don't have the inode id,
        // for frontend purposes we use the path. it's unique as well.
        id: path,
        name: fileName,
        path: path.replace('hdfs://', ''),
      },
      options,
    );
  };

  const methods = useForm({
    defaultValues: {
      type: FrameworkType.SPARK,
      appName: preparedInitial?.name,
      // Spark
      mainClass: '',
      'spark.executor.instances': 1,
      'spark.executor.cores': 1,
      'spark.executor.memory': 2048,
      'spark.dynamicAllocation.enabled': true,
      'spark.dynamicAllocation.minExecutors': 1,
      'spark.dynamicAllocation.maxExecutors': 1,
      amMemory: 2048,
      amVCores: 1,
      properties: '',
      // Python and Docker
      resourceConfig: {
        cores: 1,
        memory: 1024,
      },
      ...(!!preparedInitial && {
        type: preparedInitial.config.type,
        appName: preparedInitial.config.appName,
        defaultArgs: preparedInitial.config.defaultArgs,
        // Spark
        amMemory: +preparedInitial.config.amMemory,
        amVCores: +preparedInitial.config.amVCores,
        appPath: preparedInitial.config.appPath,
        mainClass: preparedInitial.config.mainClass,
        'spark.executor.instances':
          preparedInitial.config['spark.executor.instances'],
        'spark.executor.cores': preparedInitial.config['spark.executor.cores'],
        'spark.executor.memory':
          +preparedInitial.config['spark.executor.memory'],
        'spark.dynamicAllocation.enabled':
          preparedInitial.config['spark.dynamicAllocation.enabled'],
        'spark.dynamicAllocation.minExecutors':
          preparedInitial.config['spark.dynamicAllocation.minExecutors'],
        'spark.dynamicAllocation.maxExecutors':
          preparedInitial.config['spark.dynamicAllocation.maxExecutors'],
        properties: preparedInitial.config.properties,
        // Python and Docker
        resourceConfig: preparedInitial.config.resourceConfig,
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
  } = methods;

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSubmit = useCallback(
    handleSubmit(async (data: JobsConfig) => {
      const isObject = (val: any) => val instanceof Object;

      const req: any = {
        ...flatData(filterFields(data), ''),
        ...addDependencies(
          data.type,
          additionalArchives,
          additionalJars,
          additionalPython,
          additionalFiles,
        ),
        mainClass: addMainClass(data.type, data.mainClass),
        appPath: isObject(activeJobFile)
          ? `hdfs://${activeJobFile?.path}`
          : `hdfs://${activeJobFile}`,
      };
      submitHandler(req);
    }),
    [
      setError,
      clearErrors,
      submitHandler,
      activeJobFile,
      additionalArchives,
      additionalJars,
      additionalPython,
      additionalFiles,
    ],
  );

  const handleCloseExplorer = () => {
    setIsOpenExplorer(false);
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

  useEffect(() => {
    if (preparedInitial) {
      if (preparedInitial?.config?.appPath) {
        const path = preparedInitial.config.appPath.replace('hdfs://', '');
        const pathSplits = path.split('/');
        const fileName = pathSplits.pop();
        setActiveJobFile((prevState: any) => ({
          ...prevState,
          name: fileName,
          path,
          extension: fileName?.split('.').pop(),
        }));
      }

      if (preparedInitial?.config?.['spark.yarn.dist.pyFiles']) {
        preparedInitial.config['spark.yarn.dist.pyFiles']
          .split(',')
          .forEach((f: string) => handleInitialFile(f, 'isPython'));
      }

      if (preparedInitial?.config?.['spark.yarn.dist.jars']) {
        preparedInitial.config['spark.yarn.dist.jars']
          .split(',')
          .forEach((f: string) => handleInitialFile(f, 'isJars'));
      }

      if (preparedInitial?.config?.['spark.yarn.dist.files']) {
        preparedInitial.config['spark.yarn.dist.files']
          .split(',')
          .forEach((f: string) => handleInitialFile(f, 'isFile'));
      }

      if (preparedInitial?.config?.['spark.yarn.dist.archives']) {
        preparedInitial.config['spark.yarn.dist.archives']
          .split(',')
          .forEach((f: string) => handleInitialFile(f, 'isArchives'));
      }

      // For python
      if (preparedInitial?.config?.files) {
        preparedInitial.config.files
          .split(',')
          .forEach((f: string) => handleInitialFile(f, 'isFile'));
      }

      if (preparedInitial?.config?.type) {
        setType(preparedInitial.config.type);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preparedInitial]);

  const title = useMemo(() => {
    if (isJobs) {
      return !isEdit ? 'Create new job' : 'Edit job';
    }
    if (isJupyter) {
      return 'Jupyter server configuration';
    }
    return '';
  }, [isEdit, isJobs, isJupyter]);

  const advancedConfigProps = {
    formType,
    isLoading,
    isEdit,
    activeJobFile,
    onDelete,
    register,
    watch,
    errors,
    control,
    type,
    setType,
    setIsOpenExplorer,
    setFileExplorerOptions,
    setFileExplorerMode,
    additionalArchives,
    setAdditionalArchives,
    additionalJars,
    setAdditionalJars,
    additionalPython,
    setAdditionalPython,
    additionalFiles,
    setAdditionalFiles,
    helperForNewArr,
    canSave,
  };

  return (
    <FormProvider {...methods}>
      <Card title={title} contentProps={{ pb: 20 }}>
        <Flex flexDirection="column">
          {isJupyter && !canSave && (
            <Flex mb="20px">
              <Callout
                content="You cannot edit the Jupyter server configuration while it is running"
                type={CalloutTypes.warning}
              />
            </Flex>
          )}
          {isJobs && !isEdit && (
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
          {isJobs && sourceFromExistingJob === sourceFrom.existingJob && (
            <Flex mt="20px" width="400px" flexWrap="wrap">
              <FileUploader
                key={1}
                options="isJobFile"
                setFileExplorerMode={setFileExplorerMode}
                isDisabledUploadButton={isDisabledUploadButton}
                helperForNewArr={helperForNewArr}
              />
            </Flex>
          )}
          {/* FILE EXPLORER POPUP */}
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
          {isJobs && (
            <Flex flexDirection="column" mt={isEdit ? '0px' : '20px'}>
              <Value>File</Value>
              <Flex mt="8px" mb="20px">
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
                      helperForNewArr={helperForNewArr}
                      isDisabledUploadButton={isDisabledUploadButton}
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
                        removeHandler={(_: any) => helperForClose('isJobFile')}
                        isLoading={!activeJobFile}
                        id={activeJobFile.id}
                        fileName={activeJobFile.name}
                        located={activeJobFile.path
                          .split('/')
                          .slice(0, activeJobFile.path.split('/').length - 1)
                          .join('/')}
                      >
                        located in
                      </FileLoader>
                    </Box>
                  )}
                </Flex>
              </Flex>
            </Flex>
          )}
          {isJobs && (
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
          )}
        </Flex>
        {isJupyter && <AdvancedConfig {...advancedConfigProps} />}
      </Card>
      {isJobs && (
        <CardSecondary
          mt="20px"
          mb={isEdit && onDelete ? '20px' : '100px'}
          title="Advanced configuration"
          sx={{ width: '100%' }}
        >
          <AdvancedConfig {...advancedConfigProps} />
        </CardSecondary>
      )}

      {isLoading && <Loader />}
      {isEdit && onDelete && (
        <CardSecondary title="Danger zone" mb="100px">
          <Button
            intent="alert"
            onClick={onDelete}
            disabled={isLoading || isDisabled}
          >
            Delete job
          </Button>
        </CardSecondary>
      )}
      <Box pb="100px" />
      <JobsStickySummary
        formType={formType}
        errorsValue={errorsValue}
        isEdit={isEdit}
        onSubmit={onSubmit}
        disabled={isLoading || isDisabled}
        canSave={canSave}
      />
    </FormProvider>
  );
};

export default JobsForm;
