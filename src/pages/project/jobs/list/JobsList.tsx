import React, {
  ComponentType,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Box, Flex } from 'rebass';
import { FormProvider, useForm } from 'react-hook-form';
import {
  Button,
  Value,
  Tooltip,
  Row,
  TinyPopup,
  usePopup,
  Input,
  Popup,
  FileLoader,
} from '@logicalclocks/quartz';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import JobsFilters, { KeyFilters } from './JobsFilters';

import { Dispatch } from '../../../../store';
import useJobs from './useJobs';
import Loader from '../../../../components/loader/Loader';
import { Jobs } from '../../../../types/jobs';
import NoData from '../../../../components/no-data/NoData';
import useDrawer from '../../../../hooks/useDrawer';
import jobsListStyles from './jobsListStyles';
import useJobsRows from './useJobsRows';

import JobDrawer from '../overview/JobDrawer';
import { JobFormData, StrongRuleTypes } from '../types';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import FileExplorer from '../../../../components/file-explorer/fileExplorer';
import {
  FileExplorerMode,
  FileExplorerOptions,
  UploadFiles,
} from '../../../../components/file-explorer/types';
import { name } from '../../../../utils/validators';
import getInputValidation from '../../../../utils/getInputValidation';
import useTitle from '../../../../hooks/useTitle';
import titles from '../../../../sources/titles';
import FileUploader from '../../../../components/file-uploader/fileUploader';

const JobsList: FC = () => {
  const dispatch = useDispatch<Dispatch>();
  useTitle(titles.jobs);

  const [activeJobFile, setActiveJobFile] = useState<UploadFiles | null>(null);

  const schema = yup.object().shape({
    appName: name.label('Name'),
    appPath: yup.string().test(`${activeJobFile}`, 'File is required', () => {
      return !!activeJobFile;
    }),
  });

  const { id: projectId } = useParams();
  const { data, isLoading } = useJobs(+projectId);
  const navigate = useNavigateRelative();
  const [search, setSearch] = useState<string>('');
  const [typeFilters, onTypeFiltersChange] = useState<string[]>([]);
  const [keyFilter, setKeyFilter] = useState<KeyFilters>(KeyFilters.null);

  // Filter
  const filterJobs = (data: Jobs[], filter: string[]): Jobs[] => {
    if (filter.length) {
      return data.filter(({ jobType }) =>
        filter.some((f) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return jobType === StrongRuleTypes[f as keyof typeof StrongRuleTypes];
        }),
      );
    }
    return data.slice();
  };

  // Sort
  type JobsSortFunction = (job1: Jobs, job2: Jobs) => number;

  interface SortParams {
    [key: string]: JobsSortFunction;
  }

  const sortOptions: SortParams = {
    'last run': ({ executions: c1 }, { executions: c2 }) => {
      if (c1.count !== 0 && c2.count !== 0) {
        const time1 = new Date(c1.items[0].submissionTime).getTime();
        const time2 = new Date(c2.items[0].submissionTime).getTime();
        if (time1 === time2) {
          return 0;
        }

        return time1 < time2 ? 1 : -1;
      }
      return 0;
    },
    'last created': ({ creationTime: c1 }, { creationTime: c2 }) => {
      const time1 = new Date(c1).getTime();
      const time2 = new Date(c2).getTime();
      if (time1 === time2) {
        return 0;
      }
      return time1 < time2 ? 1 : -1;
    },
  };

  const [sort, setSort] = useState<string[]>([Object.keys(sortOptions)[0]]);
  const handleSearchChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>): void => {
    setSearch(target.value);
  };

  const searchJobsText = (data: Jobs[], text: string): Jobs[] =>
    !text
      ? data
      : data.filter(
          ({ name }) => name.toLowerCase().indexOf(text.toLowerCase()) === 0,
        );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sortJobs = (data: Jobs[], sort: string): Jobs[] => {
    const sortFunction = sortOptions[sort];

    return sortFunction ? data.sort(sortFunction) : data;
  };

  const typeFilterOptions = useMemo(
    () => Array.from(new Set(data.jobs.map(({ jobType }) => jobType))),
    [data],
  );

  const resetFilters = () => {
    setSort([Object.keys(sortOptions)[0]]);
    setSearch('');
    onTypeFiltersChange([]);
    setKeyFilter(KeyFilters.null);
  };

  const dataResult = useMemo(() => {
    const [sortKey] = sort;
    const sortedData = sortJobs(
      filterJobs(searchJobsText(data.jobs, search), typeFilters),
      sortKey,
    );

    if (keyFilter && !!sortedData.length) {
      // eslint-disable-next-line array-callback-return
      return sortedData.filter(({ executions }) => {
        if (executions.count) {
          return executions.items[0].state === 'RUNNING';
        }
        return false;
      });
    }
    return sortedData;
  }, [sort, typeFilters, search, data, keyFilter, sortJobs]);

  const onToggleKey = useCallback(
    (key: KeyFilters) => (): void => {
      setKeyFilter((current) => (current === key ? KeyFilters.null : key));
    },
    [setKeyFilter],
  );

  const handleRefresh = useCallback(() => {
    dispatch.jobs.fetch({
      projectId: +projectId,
    });
  }, [dispatch, projectId]);

  const { isOpen, selectedId, handleSelectItem, handleClose } = useDrawer();
  const [groupComponents, groupProps] = useJobsRows(dataResult);

  const [isPopupOpen, handleToggle] = usePopup();

  const methods = useForm({
    defaultValues: {
      ...(!!data && {
        appName: '',
        appPath: '',
      }),
    },
    resolver: yupResolver(schema),
  });

  const { register, handleSubmit, errors, clearErrors } = methods;

  useEffect(() => {
    if (!!activeJobFile || !isPopupOpen) {
      clearErrors('appPath');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeJobFile, isPopupOpen]);

  const [selectedRow, setSelectedRow] = useState(Math.random());
  const [isOpenExplorer, setIsOpenExplorer] = useState(false);
  const [isOpenUploadExplorer, setIsOpenUploadExplorer] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [fileToBeUpload, setFileToBeUpload] = useState<any>({});
  const [isDisabledUploadButton, setIsDisabledUploadButton] = useState(false);
  const [isDisabledProjectButton, setIsDisabledProjectButton] = useState(false);
  const [fileExplorerOptions, setFileExplorerOptions] = useState(
    FileExplorerOptions.app,
  );
  const [fileExplorerMode, setFileExplorerMode] = useState(
    FileExplorerMode.oneFile,
  );
  const [isOpenExplorerFromPopup, setIsOpenExplorerFromPopup] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleCreate = useCallback(
    handleSubmit(async (data: JobFormData) => {
      const req = {
        ...data,
        type: 'sparkJobConfiguration',
        appPath: activeJobFile
          ? `hdfs://${activeJobFile.path}/${
              !activeJobFile.name ? fileToBeUpload.name : activeJobFile.name
            }`
          : '',
        mainClass: 'io.hops.examples.featurestore_tour.Main',
      };
      const id = await dispatch.jobs.create({
        projectId: +projectId,
        data: req,
      });
      if (id) {
        dispatch.jobsView.fetch({
          projectId: +projectId,
          jobsName: data.appName,
        });

        navigate(`/jobs/${id}`, 'p/:id/*');
      }
    }),
    [activeJobFile],
  );

  const handleSelectFile = (activeFile: any, isDownload: boolean) => {
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
    // setActiveJobFile(activeFile);
    if (!isDownload) setIsOpenExplorer(false);
    setIsDisabledProjectButton(true);
    setIsDisabledUploadButton(true);
  };

  const handleSelectUploadFile = (activeFile: any, isDownload: boolean) => {
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

    if (!isDownload) setIsOpenExplorer(false);
    setIsOpenUploadExplorer(false);
  };

  useEffect(() => {
    if (activeJobFile) {
      setIsOpenExplorerFromPopup(false);
      setIsDisabledProjectButton(true);
    }
  }, [activeJobFile]);

  const helperForNewArr = (newFile: any, _options: string) => {
    const newFiles = activeJobFile?.files;
    if (newFiles) newFiles.push(newFile);
    setActiveJobFile((prevState: any) => ({
      ...prevState,
      files: newFiles,
    }));
  };

  const helperForClose = (_options: string) => {
    setActiveJobFile(null);
  };

  const handleDelete = () => {
    setIsDelete(false);
  };

  const handleCloseExplorer = () => {
    setIsOpenUploadExplorer(false);
    setIsOpenExplorer(false);
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

  const changeExplorerOptions = (currentOptions: string) => {
    const option: any = currentOptions;
    setFileExplorerOptions(option);
  };

  return (
    <>
      <FormProvider {...methods}>
        {!!selectedId && (
          <JobDrawer
            data={dataResult}
            projectId={+projectId}
            itemId={selectedId}
            isOpen={isOpen}
            handleToggle={handleClose}
            navigateTo={(id: number) => `/jobs/${id}`}
          />
        )}
        {isOpenExplorer && !isLoading && (
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
                handleSelectFile={handleSelectFile}
                mode={fileExplorerMode}
                activeFile={activeJobFile}
              />
            </Popup>
          </Box>
        )}
        <TinyPopup
          width={!isOpenExplorerFromPopup ? '440px' : '100%'}
          height={isOpenExplorerFromPopup ? '100%' : ''}
          isOpen={isPopupOpen}
          onClose={handleToggle}
          title="New Job"
          secondaryText=""
          secondaryButton={['Cancel', handleToggle]}
          mainButton={['Create new job', handleCreate]}
        >
          <Flex flexDirection="column">
            <Flex flexDirection="column">
              <Value>File</Value>
              <Flex mt="8px" mb={activeJobFile ? '20px' : '0px'}>
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
                  From project
                </Button>
                <FileUploader
                  key={2}
                  fromFile
                  options="isJobFile"
                  handleSelectFolder={handleSelectUploadFile}
                  changeExplorerOptions={changeExplorerOptions}
                  handleCloseExplorer={handleCloseExplorer}
                  helperForNewArr={helperForNewArr}
                  handleDelete={handleDelete}
                  setFileExplorerMode={setFileExplorerMode}
                  activeApp={activeJobFile}
                  fileExplorerMode={fileExplorerMode}
                  fileExplorerOptions={FileExplorerOptions.app}
                  isDisabledUploadButton={isDisabledUploadButton}
                  fileToBeUpload={fileToBeUpload}
                  setFileToBeUpload={setFileToBeUpload}
                  setactiveJobFile={setActiveJobFile}
                  isDelete={isDelete}
                  setIsDelete={setIsDelete}
                  isOpenUploadExplorer={isOpenUploadExplorer}
                  setIsOpenUploadExplorer={setIsOpenUploadExplorer}
                  setIsOpenExplorerFromPopup={setIsOpenExplorerFromPopup}
                />
              </Flex>
              <Input
                {...getInputValidation('appPath', errors)}
                sx={{
                  display: 'none',
                }}
              />
              {!!activeJobFile &&
                fileExplorerOptions === FileExplorerOptions.app && (
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
            <Flex mb="28px" flexDirection="column" mt="20px">
              <Input
                name="appName"
                placeholder="Job’s name"
                ref={register}
                label="Name"
                labelProps={{ width: '100%' }}
                disabled={isLoading}
                {...getInputValidation('appName', errors)}
              />
              <Button
                onClick={() => navigate(`/p/${projectId}/jobs/new`)}
                intent="inline"
                sx={{
                  fontFamily: 'Inter',
                  fontSize: '12px',
                  fontWeight: 700,
                  width: 'max-content',
                  textDecoration: 'none',
                  padding: 0,
                  marginTop: '28px',
                  marginLeft: 'auto',
                }}
              >
                Advanced options
              </Button>
            </Flex>
          </Flex>
        </TinyPopup>
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{
            width: '100%',
          }}
        >
          {!isLoading && !!data.jobs.length && (
            <Flex
              flexDirection="column"
              width="100%"
              sx={{
                ml: '8px',
                mr: '2px',
              }}
            >
              <JobsFilters
                sortOptions={Object.keys(sortOptions)}
                handleRefresh={handleRefresh}
                onChangeSort={setSort}
                onSearchChange={handleSearchChange}
                search={search}
                typeFilters={typeFilters}
                jobType={typeFilterOptions}
                sortKey={sort}
                onTypeFiltersChange={onTypeFiltersChange}
                onToggleKey={onToggleKey}
                keyFilter={keyFilter}
              />
              <Flex
                mt="20px"
                mb="20px"
                width="100%"
                justifySelf="flex-start"
                alignItems="center"
              >
                <Value primary px="5px">
                  {dataResult.length}
                </Value>
                <Value>out of</Value>
                <Value primary px="5px">
                  {data.jobs.length}
                </Value>
                <Value>jobs displayed</Value>
                <Tooltip ml="auto" mainText="⇧ + click, for advanced mode">
                  <Button onClick={handleToggle}>New Job</Button>
                </Tooltip>
              </Flex>
              <Flex
                width="100%"
                sx={{
                  backgroundColor: 'grayShade3',
                  tr: {
                    backgroundColor: 'white',
                  },
                  'tr:first-of-type': {
                    backgroundColor: 'grayShade3',
                  },
                }}
              >
                {!!dataResult.length && (
                  <Box sx={jobsListStyles(selectedRow, isOpen)}>
                    <Row
                      onRowClick={(_, index) => {
                        const { id } = data.jobs[index];

                        setSelectedRow(index);
                        handleSelectItem(id)();
                      }}
                      legend={[
                        'ID',
                        'Name',
                        'Author',
                        'Type',
                        'Last run',
                        'Last run duration',
                        'Last run state',
                        'Last run status',
                      ]}
                      middleColumn={8}
                      groupComponents={
                        groupComponents as ComponentType<any>[][]
                      }
                      groupProps={groupProps}
                    />
                  </Box>
                )}
              </Flex>
            </Flex>
          )}
          {isLoading && <Loader />}
        </Flex>
        {!data.jobs.length && !isLoading && (
          <NoData
            mainText="No job configured"
            secondaryText="Create a new job to run files from the user interface."
          >
            <Button
              intent="primary"
              onClick={() => navigate(`/p/${projectId}/jobs/new`)}
            >
              New job
            </Button>
          </NoData>
        )}
        {dataResult.length === 0 && !isLoading && (
          <NoData
            isFilter
            mainText="0 job match with the filters"
            secondaryText="Change or reset filters"
          >
            <Button intent="primary" onClick={resetFilters}>
              Reset filters
            </Button>
          </NoData>
        )}
      </FormProvider>
    </>
  );
};

export default JobsList;
