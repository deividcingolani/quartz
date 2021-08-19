// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { Flex, Box } from 'rebass';
import {
  Badge,
  Button,
  Labeling,
  NotificationsManager,
  usePopup,
  User,
  Value,
} from '@logicalclocks/quartz';
import { format, formatDuration, intervalToDuration } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import setStatus from '../../pages/project/jobs/utils/setStatus';
import useNavigateRelative from '../../hooks/useNavigateRelative';
import icons from '../../sources/icons';
import JobsExecutionsPopup from '../../pages/project/jobs/executions/JobsExecutionsPopup';
import { RootState } from '../../store';
import BaseApiService, { RequestType } from '../../services/BaseApiService';
import NotificationBadge from '../../utils/notifications/notificationBadge';
import NotificationContent from '../../utils/notifications/notificationValue';
import executionDurationLocale from '../../pages/project/jobs/utils/durationLocale';

export interface ExecutionsItemProps {
  executionsList: any;
  key: any;
  selectedJobName: string;
  handleTogglePopupForLogs?: any;
  setDataLog?: Dispatch<SetStateAction<any>>;
}

const ExecutionsDataItem: FC<ExecutionsItemProps> = ({
  executionsList,
  selectedJobName,
  handleTogglePopupForLogs,
  setDataLog,
}: ExecutionsItemProps) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigateRelative();

  const [disabledStopButton, setDisabledStopButton] = useState(false);

  const isExecutionsLoading = useSelector(
    (state: RootState) => state.loading.effects.jobsExecutions.fetch,
  );

  const [isHideStopButton, setIsHideStopButton] = useState(false);

  const handleStopExecutions = async (executionId: number) => {
    setDisabledStopButton(true);
    const res = await dispatch.jobs.stop({
      projectId: id,
      jobName: selectedJobName,
      executionId,
    });
    if (res.status === 204) {
      NotificationsManager.create({
        isError: false,
        type: <NotificationBadge message="Success" variant="success" />,
        content: <NotificationContent message="Job stopped" />,
      });
      setDisabledStopButton(false);
      setIsHideStopButton(true);
    } else {
      NotificationsManager.create({
        isError: false,
        type: (
          <NotificationBadge message={`Error ${res.status}`} variant="fail" />
        ),
        content: <NotificationContent message={res.statusText} />,
      });
      dispatch.error.clearError();
    }
    navigate(`/executions`, 'p/:id/jobs/:jobId/*');
  };

  const handleOpenLogs = async (executionId: number) => {
    const data = {
      projectId: +id,
      jobName: selectedJobName,
      executionId,
    };
    if (data && setDataLog && handleTogglePopupForLogs) {
      setDataLog(data);
      handleTogglePopupForLogs();
    }
  };

  const [isOpenPopupForStop, handleTogglePopupForStop] = usePopup();
  // eslint-disable-next-line
  const [kibanaUrl, setKibanaUrl] = useState(null);

  useEffect(() => {
    const loadToken = async () => {
      const res = await new BaseApiService().request({
        url: `/elastic/jwt/${id} `,
        type: RequestType.get,
      });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setKibanaUrl(res.data.kibanaUrl);
    };

    loadToken();
  }, [id]);

  return (
    <>
      {!isExecutionsLoading && (
        <Flex
          flexDirection="column"
          width="100%"
          sx={{
            backgroundColor: 'grayShade3',
          }}
        >
          <JobsExecutionsPopup
            isStop
            item={id}
            projectId={+id}
            isOpenPopup={isOpenPopupForStop}
            handleTogglePopup={handleTogglePopupForStop}
            handleStopExecutions={handleStopExecutions}
          />
          {executionsList.map((execution: any, index: any) => {
            const badgeProps: any = setStatus(execution.finalStatus);
            return (
              <Flex
                flexDirection="column"
                sx={{
                  backgroundColor: 'white',
                  width: '100%',
                  borderStyle: 'solid',
                  borderWidth: '1px',
                  borderColor: 'grayShade2',
                  p: '20px',
                  mb: '20px',
                }}
                // eslint-disable-next-line react/no-array-index-key
                key={index}
              >
                <Flex justifyContent="space-between">
                  <Flex alignItems="center" justifyContent="center">
                    <Flex flexDirection="column" mr="20px">
                      <Labeling
                        gray
                        sx={{
                          fontSize: '10px',
                        }}
                      >
                        Id
                      </Labeling>
                      <Value
                        primary
                        sx={{
                          mt: '4px',
                        }}
                      >
                        {execution.id}
                      </Value>
                    </Flex>
                    {badgeProps.value !== 'undefined' && (
                      <Box sx={{ width: '78px', height: '19px', mr: '20px' }}>
                        <Badge
                          variant={badgeProps.variant}
                          value={badgeProps.value}
                        />
                      </Box>
                    )}
                    <Flex flexDirection="column" mt="0px">
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
                        {execution.state.toLowerCase()}
                      </Value>
                    </Flex>
                  </Flex>
                  <Flex>
                    <Box>
                      <Button
                        mx="8px"
                        px="7.5px"
                        intent="ghost"
                        disabled={!execution.monitoring}
                        href={`
                           ${process.env.REACT_APP_API_HOST_EXEC}/${execution.monitoring?.sparkUrl}
                        `}
                        onClick={() =>
                          window.open(
                            `
                          ${process.env.REACT_APP_API_HOST_EXEC}/${execution.monitoring?.sparkUrl}
                        `,
                            '_blank',
                          )
                        }
                      >
                        Spark UI ↗
                      </Button>
                    </Box>
                    <Box
                      sx={{
                        borderLeftStyle: 'solid',
                        borderLeftWidth: '1px',
                        borderLeftColor: 'grayShade2',
                      }}
                    >
                      <Button
                        mx="8px"
                        px="7.5px"
                        intent="ghost"
                        disabled={!execution.monitoring}
                        href={`
                          ${process.env.REACT_APP_API_HOST_EXEC}/${execution.monitoring?.yarnUrl}
                        `}
                        onClick={() =>
                          window.open(
                            `
                          ${process.env.REACT_APP_API_HOST_EXEC}/${execution.monitoring?.yarnUrl}
                        `,
                            '_blank',
                          )
                        }
                      >
                        RM UI ↗
                      </Button>
                    </Box>
                    <Box
                      sx={{
                        borderLeftStyle: 'solid',
                        borderLeftWidth: '1px',
                        borderLeftColor: 'grayShade2',
                      }}
                    >
                      <Button
                        mx="8px"
                        px="7.5px"
                        intent="ghost"
                        disabled={!execution.monitoring}
                        href={`
                          ${process.env.REACT_APP_API_HOST_EXEC}/${execution.monitoring?.grafanaUrl}
                        `}
                        onClick={() =>
                          window.open(
                            `
                          ${process.env.REACT_APP_API_HOST_EXEC}/${execution.monitoring?.grafanaUrl}
                        `,
                            '_blank',
                          )
                        }
                      >
                        Monitor ↗
                      </Button>
                    </Box>
                    <Box
                      sx={{
                        borderLeftStyle: 'solid',
                        borderLeftWidth: '1px',
                        borderLeftColor: 'grayShade2',
                      }}
                    >
                      <Button
                        mx="8px"
                        px="7.5px"
                        intent="ghost"
                        disabled={!execution.monitoring}
                        href={`
                          ${process.env.REACT_APP_API_DOMAIN}${kibanaUrl}${execution.monitoring?.kibanaUrl}
                        `}
                        onClick={() =>
                          window.open(
                            `
                          ${process.env.REACT_APP_API_DOMAIN}${kibanaUrl}${execution.monitoring?.kibanaUrl}
                        `,
                            '_blank',
                          )
                        }
                      >
                        Kibana ↗
                      </Button>
                    </Box>
                    <Box
                      sx={{
                        borderLeftStyle: 'solid',
                        borderLeftWidth: '1px',
                        borderLeftColor: 'grayShade2',
                      }}
                    >
                      <Button
                        mx="8px"
                        px="7.5px"
                        intent="ghost"
                        href="https://docs.hopsworks.ai/latest/generated/api/feature_group_api/#get_feature_group"
                        onClick={() => handleOpenLogs(execution.id)}
                      >
                        Logs
                      </Button>
                    </Box>
                  </Flex>
                </Flex>
                <Flex justifyContent="space-between" mt="10px">
                  <Flex>
                    <User
                      firstName={execution.user.firstname}
                      lastName={execution.user.lastname}
                    />
                    <Flex flexDirection="column" mx="20px">
                      <Labeling
                        gray
                        sx={{
                          fontSize: '10px',
                        }}
                      >
                        YARN Application ID
                      </Labeling>
                      <Value
                        sx={{
                          mt: '4px',
                        }}
                      >
                        {execution.appId || '-'}
                      </Value>
                    </Flex>
                    <Flex flexDirection="column" mr="20px">
                      <Labeling
                        gray
                        sx={{
                          fontSize: '10px',
                        }}
                      >
                        Execution time
                      </Labeling>
                      <Value
                        sx={{
                          mt: '4px',
                        }}
                      >
                        {execution.duration
                          ? formatDuration(
                              intervalToDuration({
                                start: 0,
                                end: execution.duration,
                              }),
                              {
                                format: ['days', 'hours', 'minutes', 'seconds'],
                                locale: executionDurationLocale,
                              },
                            )
                          : '-'}
                      </Value>
                    </Flex>
                    <Flex flexDirection="column" mr="20px">
                      <Labeling
                        gray
                        sx={{
                          fontSize: '10px',
                        }}
                      >
                        Submission time
                      </Labeling>
                      <Value
                        sx={{
                          mt: '4px',
                        }}
                      >
                        {format(
                          new Date(execution.submissionTime),
                          'dd-MM-yyyy HH:mm:ss',
                        )}
                      </Value>
                    </Flex>
                    <Flex flexDirection="column" mr="20px">
                      <Labeling
                        gray
                        sx={{
                          fontSize: '10px',
                        }}
                      >
                        Arguments
                      </Labeling>
                      <Value
                        sx={{
                          mt: '4px',
                          wordBreak: 'break-all',
                        }}
                      >
                        {execution.args || '-'}
                      </Value>
                    </Flex>
                  </Flex>
                  {execution.state === 'RUNNING' && !isHideStopButton && (
                    <Button
                      intent="alert"
                      disabled={disabledStopButton}
                      onClick={() => handleStopExecutions(execution.id)}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          svg: {
                            mr: '5px',
                          },
                        }}
                      >
                        {icons.stop}
                        Stop
                      </Box>
                    </Button>
                  )}
                </Flex>
              </Flex>
            );
          })}
        </Flex>
      )}
    </>
  );
};

export default ExecutionsDataItem;
