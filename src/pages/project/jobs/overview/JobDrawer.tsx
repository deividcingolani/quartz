import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Drawer,
  Labeling,
  TextValueBadge,
  Value,
  NotificationsManager,
} from '@logicalclocks/quartz';
import { Box, Flex } from 'rebass';
import { format, fromUnixTime } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import routeNames from '../../../../routes/routeNames';
import Loader from '../../../../components/loader/Loader';
import { DataEntity } from '../../../../types';
import { Dispatch, RootState } from '../../../../store';
import CommitGraph from './../../../../components/drawer/commit-graph';
import icons from '../../../../sources/icons';
import { setStatus } from '../utils/setStatus';
import { setTypeOfJob } from '../utils/setTypeOfJob';
import { ExecutionsTypeSortOptions } from '../executions/types';
import { JobExecutionData } from '../../../../types/jobs';
import { getAVGtime } from '../utils/getAVGtime';
import { getPathAndFileName } from '../utils/getPathAndFileName';
import ExecutionDropdown from './ExecutionDropdown';
import NotificationBadge from '../../../../utils/notifications/notificationBadge';
import NotificationContent from '../../../../utils/notifications/notificationValue';

export interface JobsDrawerProps<T extends DataEntity> {
  itemId: number;
  data: T[];
  handleToggle: () => void;
  navigateTo: (to: number) => string;
  isOpen: boolean;
  isSearch?: boolean;
  projectId?: number;
}

const JobDrawer = <T extends DataEntity>({
  itemId,
  handleToggle,
  data,
  isOpen,
  navigateTo,
  isSearch,
  projectId,
}: JobsDrawerProps<T>) => {
  const navigate = useNavigateRelative();

  const handleNavigate = useCallback(
    (route: string) => (): void => {
      dispatch.jobsExecutions.clear();
      if (isSearch && projectId) {
        navigate(`/p/${projectId}${route}`);
      } else {
        navigate(route, routeNames.project.view);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigate, isSearch, projectId],
  );

  const isJobsLoading = useSelector(
    (state: RootState) => state.loading.effects.jobs.fetch,
  );

  const isJobsExecutionsLoading = useSelector(
    (state: RootState) => state.loading.effects.jobsView.fetch,
  );

  const dispatch = useDispatch<Dispatch>();

  const item: any = useMemo(() => data.find(({ id }) => id === itemId), [
    itemId,
    data,
  ]);

  useEffect(() => {
    if (projectId && item) {
      dispatch.jobsView.fetch({ projectId: projectId, jobsName: item.name });
      dispatch.jobsExecutions.fetch({
        projectId: projectId,
        jobsName: item.name,
        eventType: ExecutionsTypeSortOptions.ALL,
        isSorting: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId, projectId, item]);

  const jobsItem = useSelector((state: RootState) => state.jobsView);
  const jobsExecutions = useSelector(
    (state: RootState) => state.jobsExecutions,
  );
  const [disabledQuickRunButton, setDisabledQuickRunButton] = useState(false);

  const [sortExecution, setSortExecution] = useState([]);
  const [sortByDay, setSortByDay] = useState<any>([]);

  const sortByDayFunc = (jobsItem: any) => {
    const items = jobsItem.executions.items.slice(0, 30);
    return items.reduce(
      (a: any, b: any) => ({
        ...a,
        [format(new Date(b.submissionTime), 'M/d/yyyy')]:
          (a[format(new Date(b.submissionTime), 'M/d/yyyy')] || 0) + 1,
      }),
      {},
    );
  };

  useEffect(() => {
    if (projectId && item) {
      dispatch.jobsView.fetch({
        projectId: projectId,
        jobsName: item.name,
      });
    }
  }, [dispatch.jobsView, item, projectId]);

  useEffect(() => {
    if (jobsItem && !!jobsItem?.executions.count) {
      jobsItem.executions.items.sort((exec1: any, exec2: any): any => {
        const time1 = new Date(exec1.submissionTime).getTime();
        const time2 = new Date(exec2.submissionTime).getTime();
        if (time1 === time2) {
          return 0;
        }
        return time1 < time2 ? 1 : -1;
      });
      setSortByDay(sortByDayFunc(jobsItem));
      setSortExecution(jobsItem.executions.items.slice(0, 3));
    }
  }, [jobsItem]);

  const onRun = async () => {
    setDisabledQuickRunButton(true);
    if (projectId && item) {
      const res = await dispatch.jobs.run({
        projectId: +projectId,
        jobName: item.name,
        argumentsData: '',
      });
      if (res.status === 201) {
        setDisabledQuickRunButton(false);
        NotificationsManager.create({
          isError: false,
          type: <NotificationBadge message="Success" variant="success" />,
          content: <NotificationContent message="Job started" />,
        });
        handleToggle();
      }
    }
  };

  const executionsAVG =
    jobsItem && !!jobsItem?.executions.count
      ? getAVGtime(jobsItem.executions.items)
      : '-';

  const handleNavigateToExecutions = () => {
    dispatch.jobsExecutions.clear();
    navigate(`/p/${projectId}/jobs/${itemId}/executions`);
  };

  if (!item) {
    return (
      <Drawer
        mt="10px"
        bottom="20px"
        closeOnBackdropClick={false}
        isOpen={isOpen}
        bottomButton={[`Open Jobs Page ->`, handleNavigate(navigateTo(itemId))]}
        onClose={handleToggle}
      >
        <Loader />
      </Drawer>
    );
  }

  return (
    <>
      <Drawer
        mt="10px"
        bottom="20px"
        isOpen={isOpen}
        headerSummary={
          <Box height="100%">
            <Flex
              flexWrap="wrap"
              sx={{
                rowGap: '8px',
              }}
              height="100%"
            >
              <TextValueBadge
                variant="gray"
                text="executions"
                value={
                  jobsItem && !!jobsItem?.executions.count
                    ? jobsItem.executions.count
                    : '0'
                }
              />
              <>
                {isJobsLoading ? (
                  <Labeling mx="8px" mt="3px" gray>
                    loading...
                  </Labeling>
                ) : (
                  <TextValueBadge
                    variant="gray"
                    ml="8px"
                    text="avg execution time"
                    value={executionsAVG}
                  />
                )}
              </>
            </Flex>
          </Box>
        }
        bottomButton={[
          `Open job overview ->`,
          handleNavigate(navigateTo(itemId)),
        ]}
        onClose={handleToggle}
      >
        <Box maxHeight="100%" overflowY="auto">
          <Drawer.Section
            title="Last executions"
            width="100%"
            action={['view all executions -->', handleNavigateToExecutions]}
          >
            <Flex flexDirection="column" width="100%">
              {isJobsExecutionsLoading && (
                <Box width="100%" height="55px" sx={{ position: 'relative' }}>
                  <Loader />
                </Box>
              )}
              {!isJobsExecutionsLoading &&
                !!jobsItem &&
                !!jobsItem.executions.count && (
                  <Button
                    intent="secondary"
                    disabled={disabledQuickRunButton}
                    onClick={onRun}
                    sx={{
                      fontFamily: 'Inter',
                      fontSize: '12px',
                      fontWeight: 700,
                      marginRight: 'auto',
                      borderRadius: '0px',
                      mb: '10px',
                    }}
                  >
                    <Flex
                      sx={{
                        alignItems: 'center',
                        svg: {
                          marginRight: '10px',
                        },
                      }}
                    >
                      {icons.play}Quick run
                    </Flex>
                  </Button>
                )}
              {!isJobsExecutionsLoading &&
                sortExecution &&
                sortExecution.map((ex: JobExecutionData, index: number) => {
                  const status: any = setStatus(ex.finalStatus);
                  return (
                    <Flex
                      key={index}
                      width="100%"
                      p="10px"
                      justifyContent="space-between"
                      sx={{
                        borderColor: 'grayShade3',
                        borderStyle: 'solid',
                        borderWidth: '1px',
                      }}
                    >
                      <Flex flexDirection="column" width="100%">
                        <Flex mb="18px">
                          <Badge
                            variant={status.variant}
                            value={status.value}
                          />
                          <Value ml="20px">{ex.appId}</Value>
                        </Flex>
                        <Flex alignItems="center" width="100%">
                          <Flex
                            flexDirection="column"
                            ml="0px"
                            mr="20px"
                            minWidth="48px"
                          >
                            <Labeling
                              gray
                              sx={{
                                fontSize: '10px',
                              }}
                            >
                              State
                            </Labeling>
                            <Value
                              primary
                              sx={{
                                mt: '4px',
                              }}
                            >
                              {
                                ExecutionsTypeSortOptions[
                                  ex.state as keyof typeof ExecutionsTypeSortOptions
                                ]
                              }
                            </Value>
                          </Flex>
                          <Flex flexDirection="column" ml="0px" mr="20px">
                            <Labeling
                              gray
                              sx={{
                                fontSize: '10px',
                              }}
                            >
                              Submited at
                            </Labeling>
                            <Value
                              sx={{
                                mt: '4px',
                              }}
                              primary
                            >
                              {format(
                                new Date(ex.submissionTime),
                                'dd-MM-yyyy HH:mm:ss',
                              )}
                            </Value>
                          </Flex>
                          <Flex flexDirection="column" ml="0px" mr="20px">
                            <Labeling
                              gray
                              sx={{
                                fontSize: '10px',
                              }}
                            >
                              Duration
                            </Labeling>
                            <Value
                              primary
                              sx={{
                                mt: '4px',
                              }}
                            >
                              {format(
                                new Date(fromUnixTime(ex.duration)),
                                "h'h' mm'm' ss's'",
                              )}
                            </Value>
                          </Flex>
                        </Flex>
                      </Flex>
                      {jobsExecutions &&
                        !!jobsItem &&
                        !!jobsItem.executions.count && (
                          <ExecutionDropdown
                            executionId={+ex.id}
                            jobName={item.name}
                            userInfo={jobsExecutions.items[index].user}
                          />
                        )}
                    </Flex>
                  );
                })}
              {!isJobsExecutionsLoading &&
                !!jobsItem &&
                !jobsItem.executions.count && (
                  <Labeling gray>No execution</Labeling>
                )}
            </Flex>
          </Drawer.Section>
          <Drawer.Section
            title="Activity"
            width="100%"
            action={['view all executions -->', handleNavigateToExecutions]}
          >
            {isJobsExecutionsLoading && (
              <Box width="100%" height="55px" sx={{ position: 'relative' }}>
                <Loader />
              </Box>
            )}
            {!isJobsExecutionsLoading &&
              jobsItem &&
              !!jobsItem.executions.count && (
                <CommitGraph
                  values={Object.keys(sortByDay).map((key: any) => ({
                    date: format(new Date(key), 'dd-MM-yyyy'),
                    executions: sortByDay[key],
                    deleted: 0,
                    modified: 0,
                  }))}
                  groupKey="date"
                  keys={['executions']}
                  type="executions"
                />
              )}
            {!isJobsExecutionsLoading &&
              !!jobsItem &&
              !jobsItem.executions.count && (
                <Labeling gray>No recent activity</Labeling>
              )}
          </Drawer.Section>
          <Drawer.Section title="Jobs details">
            {isJobsExecutionsLoading && (
              <Box width="100%" height="55px" sx={{ position: 'relative' }}>
                <Loader />
              </Box>
            )}
            {!isJobsLoading &&
              !isJobsExecutionsLoading &&
              (!!jobsItem ? (
                <Flex width="100%" flexDirection="column">
                  <Flex flexDirection="column" mt="0px">
                    <Labeling
                      gray
                      sx={{
                        fontSize: '10px',
                      }}
                    >
                      Framework
                    </Labeling>
                    <Value
                      primary
                      sx={{
                        mt: '4px',
                      }}
                    >
                      {setTypeOfJob(jobsItem.config.jobType)}
                    </Value>
                  </Flex>
                  <Flex flexDirection="column" mt="20px">
                    <Labeling
                      gray
                      sx={{
                        fontSize: '10px',
                      }}
                    >
                      File name
                    </Labeling>
                    <Value
                      primary
                      sx={{
                        mt: '4px',
                      }}
                    >
                      {getPathAndFileName(jobsItem.config.appPath).fileName}
                    </Value>
                  </Flex>
                  <Flex flexDirection="column" mt="20px">
                    <Labeling
                      gray
                      sx={{
                        fontSize: '10px',
                      }}
                    >
                      Main class
                    </Labeling>
                    <Value
                      primary
                      sx={{
                        mt: '4px',
                      }}
                    >
                      {jobsItem.config.mainClass}
                    </Value>
                  </Flex>
                  <Flex flexDirection="column" mt="20px">
                    <Labeling
                      gray
                      sx={{
                        fontSize: '10px',
                      }}
                    >
                      Default arguments
                    </Labeling>
                    <Value
                      primary
                      sx={{
                        mt: '4px',
                      }}
                    >
                      {jobsItem.config.defaultArgs || '-'}
                    </Value>
                  </Flex>
                </Flex>
              ) : (
                <Labeling gray>No tag schemas attached</Labeling>
              ))}
          </Drawer.Section>
        </Box>
      </Drawer>
    </>
  );
};

export default JobDrawer;
