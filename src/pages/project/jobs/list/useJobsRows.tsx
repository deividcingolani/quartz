// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { useCallback, useMemo } from 'react';
import { Value, Badge, Tooltip, User } from '@logicalclocks/quartz';
import { Flex } from 'rebass';
import { formatDuration, intervalToDuration, formatDistance } from 'date-fns';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import icons from '../../../../sources/icons';
import routeNames from '../../../../routes/routeNames';

// utils
import setStatus from '../utils/setStatus';
import executionDurationLocale from '../utils/durationLocale';
import getHrefNoMatching from '../../../../utils/getHrefNoMatching';

const useJobsListRowData = (jobs: any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const handleNavigate = useCallback(
    (jobId: number, route: string) => (): void => {
      dispatch.jobsExecutions.clear();
      navigate(
        getHrefNoMatching(route, routeNames.project.value, true, {
          id,
          jobId,
        }),
      );
    },
    [id, navigate, dispatch.jobsExecutions],
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
        onClick: handleNavigate(job.id, routeNames.jobs.overview),
      },
      {
        children: job.name,
        onClick: handleNavigate(job.id, routeNames.jobs.overview),
      },
      {
        children: (
          <User
            firstName={String(job.creator.firstname)}
            lastName={String(job.creator.lastname)}
            isTooltipActive
          />
        ),
      },
      {
        children: job.jobType,
      },
      {
        children:
          job.executions.count !== 0
            ? formatDistance(
                new Date(job.executions.items[0].submissionTime),
                new Date(),
              )
            : 'never started',
        primary: true,
      },
      {
        children:
          job.executions.count !== 0 && job.executions.items[0].duration
            ? formatDuration(
                intervalToDuration({
                  start: 0,
                  end: job.executions.items[0].duration,
                }),
                {
                  format: ['days', 'hours', 'minutes', 'seconds'],
                  locale: executionDurationLocale,
                },
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
                onClick={handleNavigate(job.id, routeNames.jobs.overview)}
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
                onClick={handleNavigate(job.id, routeNames.jobs.executions)}
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
  }, [jobs, handleNavigate]);

  return useMemo(() => {
    return [jobsComponents, jobsProps];
  }, [jobsComponents, jobsProps]);
};

export default useJobsListRowData;
