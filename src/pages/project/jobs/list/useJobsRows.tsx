import React, { useCallback, useMemo } from 'react';
import { Value, Badge, Tooltip, User } from '@logicalclocks/quartz';
import { Flex } from 'rebass';
import icons from '../../../../sources/icons';
import ProfileService from '../../../../services/ProfileService';
import { format, fromUnixTime } from 'date-fns';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import routeNames from '../../../../routes/routeNames';

//utils
import { setStatus } from '../utils/setStatus';
import { setTypeOfJob } from '../utils/setTypeOfJob';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const useJobsListRowData = (jobs: any) => {
  const navigate = useNavigateRelative();
  const dispatch = useDispatch();
  const { id } = useParams();

  const calculateLastRun = (date: string) => {
    const toDay = new Date().getTime();
    const lastRun = new Date(date).getTime();

    return Math.ceil(Math.abs(toDay - lastRun) / (1000 * 3600 * 24));
  };

  const handleNavigate = useCallback(
    (jobId: number, route: string) => (): void => {
      dispatch.jobsExecutions.clear();
      navigate(route.replace(':jobId', String(jobId)), routeNames.project.view);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigate],
  );

  const jobsComponents = useMemo(() => {
    return jobs.map(() => [
      Value,
      Value,
      Flex,
      Value,
      Value,
      Value,
      Value,
      Badge,
      Flex,
    ]);
  }, [jobs]);

  const jobsProps = useMemo(() => {
    return jobs.map((job: any) => [
      {
        children: `#${job.id}`,
        gray: true,
        onClick: () => {
          handleNavigate(job.id, routeNames.jobs.overview)();
        },
      },
      {
        children: job.name,
        onClick: () => {
          handleNavigate(job.id, routeNames.jobs.overview)();
        },
      },
      {
        children: (
          <User
            name={String(job.creator.firstname)}
            isTooltipActive
            photo={ProfileService.avatar(job.creator.email)}
          />
        ),
      },
      {
        children: setTypeOfJob(job.jobType),
      },
      {
        children:
          job.executions.count !== 0
            ? `${calculateLastRun(
                job.executions.items[0].submissionTime,
              )} days ago`
            : 'never started',
        primary: true,
      },
      {
        children:
          job.executions.count !== 0
            ? format(
                new Date(fromUnixTime(job.executions.items[0].duration)),
                "h'h' mm'm' ss's'",
              )
            : '-',
        primary: true,
      },
      {
        children:
          job.executions.count !== 0
            ? job.executions.items[0].state.toLowerCase()
            : '-',
        primary: true,
      },
      job.executions.count !== 0
        ? setStatus(job.executions.items[0].finalStatus, job.executions.items)
        : {
            width: '',
            value: '',
            variant: '',
          },
      {
        children: (
          <Flex
            sx={{
              width: '100%',
              justifyContent: 'flex-end',
            }}
          >
            <Tooltip mainText="Preview">
              <Flex
                justifyContent="center"
                alignItems="center"
                width="34px"
                height="32px"
                sx={{
                  boxShadow: '0px 5px 15px rgba(144, 144, 144, 0.2)',
                  borderStyle: 'solid',
                  borderWidth: '1px',
                  borderColor: 'grayShade2',
                  cursor: 'pointer',
                  transition: 'all .25s ease',

                  ':hover': {
                    borderColor: 'black',
                  },
                }}
              >
                {icons.eye}
              </Flex>
            </Tooltip>
            <Tooltip ml="20px" mainText="Overview">
              <Flex
                onClick={() => {
                  handleNavigate(job.id, routeNames.jobs.overview)();
                }}
                justifyContent="center"
                alignItems="center"
                width="32px"
                height="32px"
                sx={{
                  boxShadow: 'secondary',
                  borderStyle: 'solid',
                  borderWidth: '1px',
                  borderColor: 'grayShade2',
                  cursor: 'pointer',
                  transition: 'all .25s ease',

                  ':hover': {
                    borderColor: 'black',
                  },
                }}
              >
                {icons.more_zoom}
              </Flex>
            </Tooltip>
            <Tooltip ml="6px" mainText="Executions">
              <Flex
                onClick={() => {
                  dispatch.jobsExecutions.clear();
                  navigate(`/p/${id}/jobs/${job.id}/executions`);
                }}
                justifyContent="center"
                alignItems="center"
                width="32px"
                height="32px"
                sx={{
                  boxShadow: '0px 5px 15px rgba(144, 144, 144, 0.2)',
                  borderStyle: 'solid',
                  borderWidth: '1px',
                  borderColor: 'grayShade2',
                  cursor: 'pointer',
                  transition: 'all .25s ease',

                  ':hover': {
                    borderColor: 'black',
                  },
                }}
              >
                {icons.history}
              </Flex>
            </Tooltip>
          </Flex>
        ),
      },
    ]);
  }, [jobs, id, handleNavigate, navigate]);

  return useMemo(() => {
    return [jobsComponents, jobsProps];
  }, [jobsComponents, jobsProps]);
};

export default useJobsListRowData;
