import React, {
  ComponentType,
  FC,
  useCallback,
  useEffect,
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
  Label,
  Pagination,
} from '@logicalclocks/quartz';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import JobsFilters, { KeyFilters } from './JobsFilters';

import { Dispatch } from '../../../../store';
import useJobs from './useJobs';
import Loader from '../../../../components/loader/Loader';
import { JobsConfig, JobType } from '../../../../types/jobs';
import NoData from '../../../../components/no-data/NoData';
import useDrawer from '../../../../hooks/useDrawer';
import jobsListStyles from './jobsListStyles';
import useJobsRows from './useJobsRows';

import JobDrawer from '../overview/JobDrawer';
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
import { JobListSortType } from '../types';
import getJobListSortStr from '../utils/getJobListSortStr';

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

  // Sort
  const [sort, setSort] = useState<JobListSortType>(
    JobListSortType.SUBMISSION_TIME,
  );
  // Job type filters
  const [typeFilters, setTypeFilters] = useState<string[]>([]);

  const jobsPage = 20;
  const [page, setPage] = useState(1);

  const { id: projectId } = useParams();
  const { data, isLoading } = useJobs(
    +projectId,
    jobsPage,
    (page - 1) * jobsPage,
    sort,
    typeFilters,
  );
  const navigate = useNavigateRelative();
  const [search, setSearch] = useState<string>('');
  const [keyFilter, setKeyFilter] = useState<KeyFilters>(KeyFilters.null);
  const [isFilter, setIsFilter] = useState<boolean>(false);

  // Pagination configuration
  const totalPages = Math.ceil(data.jobCount / jobsPage);

  const fetchJobList = useCallback(
    (sort, types, search, running) => {
      dispatch.jobs.fetch({
        projectId: +projectId,
        limit: jobsPage,
        offset: (page - 1) * jobsPage,
        sortBy: getJobListSortStr(sort),
        types,
        nameFilter: search,
        lastExecState: running ? 'RUNNING' : '',
      });
    },
    [dispatch, projectId, page],
  );

  const handleRefresh = useCallback(() => {
    fetchJobList(sort, typeFilters, search, keyFilter !== KeyFilters.null);
  }, [fetchJobList, sort, typeFilters, search, keyFilter]);

  const handleSortChange = useCallback(
    (newSortArr) => {
      const [newSort] = newSortArr;
      setSort(newSort);
    },
    [setSort],
  );

  const handleTypeFilterChange = useCallback(
    (newTypeFilter: string[]) => {
      const jobTypeList = newTypeFilter.filter(
        (jobType: string) => jobType !== 'any',
      );
      if (jobTypeList.length) {
        setIsFilter(true);
      }
      setTypeFilters(jobTypeList);
    },
    [setTypeFilters],
  );

  const handleSearchChange = useCallback(
    ({ target }: React.ChangeEvent<HTMLInputElement>): void => {
      setSearch(target.value);
      if (target.value !== '') {
        setIsFilter(true);
      }
    },
    [setIsFilter, setSearch],
  );

  const onToggleKey = useCallback(
    (key: KeyFilters) => (): void => {
      setKeyFilter((current) => {
        if (current === key) {
          return KeyFilters.null;
        }
        setIsFilter(true);
        return key;
      });
    },
    [setKeyFilter, setIsFilter],
  );

  useEffect(() => {
    fetchJobList(sort, typeFilters, search, keyFilter !== KeyFilters.null);
  }, [fetchJobList, sort, typeFilters, search, keyFilter]);

  const resetFilters = () => {
    setSort(JobListSortType.SUBMISSION_TIME);
    setSearch('');
    setTypeFilters([]);
    setKeyFilter(KeyFilters.null);
    setIsFilter(false);
    fetchJobList(sort, [], '', false);
  };

  const { isOpen, selectedId, handleSelectItem, handleClose } = useDrawer();
  const [groupComponents, groupProps] = useJobsRows(data.jobs);

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
    handleSubmit(async (data: JobsConfig) => {
      const req = {
        ...data,
        type: 'sparkJobConfiguration',
        appPath: activeJobFile?.path,
        mainClass: 'org.apache.spark.deploy.PythonRunner',
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

  useEffect(() => {
    if (activeJobFile) {
      setIsOpenExplorerFromPopup(false);
      setIsDisabledProjectButton(true);
    }
  }, [activeJobFile]);

  const helperForNewArr = (newFile: any, _options: string) => {
    setActiveJobFile(newFile);
  };

  const helperForClose = (_options: string) => {
    setActiveJobFile(null);
  };

  const handleCloseExplorer = () => {
    setIsOpenExplorer(false);
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

  return (
    <>
      <FormProvider {...methods}>
        {!!selectedId && (
          <JobDrawer
            data={data.jobs}
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
                  }}
                >
                  From project
                </Button>
                <FileUploader
                  key={2}
                  fromFile
                  isEdit
                  options="isJobFile"
                  helperForNewArr={helperForNewArr}
                  isDisabledUploadButton={isDisabledUploadButton}
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
          <JobsFilters
            sortOptions={[
              JobListSortType.SUBMISSION_TIME,
              JobListSortType.CREATION_TIME,
            ]}
            handleRefresh={handleRefresh}
            onChangeSort={handleSortChange}
            onSearchChange={handleSearchChange}
            search={search}
            typeFilters={typeFilters}
            jobType={Object.values(JobType)}
            sortKey={[sort]}
            onTypeFiltersChange={handleTypeFilterChange}
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
              {data.jobs.length * page}
            </Value>
            <Value>out of</Value>
            <Value primary px="5px">
              {data.jobCount || 0}
            </Value>
            <Tooltip ml="auto" mainText="⇧ + click, for advanced mode">
              <Button onClick={handleToggle}>New Job</Button>
            </Tooltip>
          </Flex>
          {!isLoading && !!data.jobs.length && (
            <Flex
              flexDirection="column"
              width="100%"
              sx={{
                ml: '8px',
                mr: '2px',
              }}
            >
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
                {!!data.jobs.length && (
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
              {!!data.jobs.length && (
                <Flex alignContent="center" width="100%">
                  <Box
                    mx="auto"
                    sx={{
                      span: {
                        marginTop: '4px',
                      },
                    }}
                  >
                    <Label ml="10px" as="span" text="go to page" align="left">
                      <Pagination
                        variant="white"
                        disabled={totalPages === 1}
                        totalPages={totalPages}
                        currentPage={page}
                        onChange={setPage}
                      />
                    </Label>
                  </Box>
                </Flex>
              )}
            </Flex>
          )}
          {isLoading && <Loader />}
        </Flex>
        {!data.jobs.length && !isFilter && !isLoading && (
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
        {isFilter && !isLoading && data.jobs.length === 0 && (
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
