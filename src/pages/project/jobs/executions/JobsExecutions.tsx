// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { parse } from 'date-fns';
import JobsExecutionsContent from './JobsExecutionsContent';
import { RootState } from '../../../../store';
import { JobsViewExecutions } from '../../../../store/models/jobs/executions/jobsExecutions.model';
import useJobs from '../list/useJobs';
import Loader from '../../../../components/loader/Loader';
import routeNames from '../../../../routes/routeNames';
import { ExecutionsTypeSortOptions } from './types';
import useTitle from '../../../../hooks/useTitle';
import titles from '../../../../sources/titles';
import NoData from '../../../../components/no-data/NoData';
import getHrefNoMatching from '../../../../utils/getHrefNoMatching';

const JobsExecutions: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id, jobId, type, from, to } = useParams();

  const { data } = useJobs(+id);
  const batchSize = 30;

  const item = data.jobs.find(({ id }) => id === +jobId);

  useTitle(`${titles.executions} - ${item?.name}`);

  const isLoading = useSelector(
    (state: RootState) => state.loading.effects.jobsExecutions.fetch,
  );

  const eventType = Object.keys(ExecutionsTypeSortOptions).includes(type)
    ? ExecutionsTypeSortOptions[type as keyof typeof ExecutionsTypeSortOptions]
    : ExecutionsTypeSortOptions.ALL;

  const [event, setEvent] = useState<ExecutionsTypeSortOptions>(eventType);

  const executionData = useSelector<RootState, JobsViewExecutions>(
    (state: RootState) => state.jobsExecutions,
  );

  const fromTestDate = useMemo(() => {
    return !!executionData && !isLoading
      ? Object.keys(executionData).pop()
      : new Date();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [executionData]);

  const [fromDate, setFromDate] = useState(() => {
    if (from) {
      return new Date(+from);
    }

    if (fromTestDate) {
      return new Date(fromTestDate);
    }

    return new Date();
  });

  const [toDate, setToDate] = useState(to ? new Date(+to) : new Date());

  const loadPrimaryExecutionsData = useCallback(async () => {
    if (item?.name) {
      await dispatch.jobsExecutions.fetch({
        projectId: +id,
        jobsName: item.name,
        eventType: event,
        offsetOptions: {
          offset: 0,
          limit: batchSize,
        },
        timeOptions: {
          from: from ? +fromDate : from,
          to: +toDate,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, id]);

  useEffect(() => {
    loadPrimaryExecutionsData();
  }, [data, id, loadPrimaryExecutionsData]);

  useEffect(() => {
    if (executionData) {
      const dd = Object.keys(executionData).pop();
      if (dd && !from) {
        setFromDate(parse(dd, 'dd MMM. y', new Date()));
      } else if (!from) {
        setFromDate(new Date());
      }
    }
  }, [executionData, from]);

  const [isFirstLoad, setFirstLoad] = useState(true);
  const [dataAfterLoad, setData] = useState<any>();

  useEffect(() => {
    if (isFirstLoad && !isLoading && executionData) {
      setData(Object.keys(executionData).pop());
      setFirstLoad(false);
    }
    setFirstLoad(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, isFirstLoad, executionData]);

  const changeStartDate = (date: Date) => {
    setFromDate(date);
  };

  const changeEndDate = (date: Date) => {
    setToDate(date);
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
  const [twentyEventDate, setDateOfTwentyEvent] = useState(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    new Date(fromTestDate),
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
  const [offset, setOffset] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
  const [hasData, setHasData] = useState({
    hasMore: true,
    hasPrevious: true,
    hasFollowing: false,
  });

  const handleRefreshData = useCallback(
    async (
      data: {
        newStartDate?: Date;
        newEndDate?: Date;
        newEvent?: ExecutionsTypeSortOptions;
      } = {},
    ) => {
      const { newEndDate, newStartDate, newEvent } = data;
      if (item?.name) {
        const count = await dispatch.jobsExecutions.fetch({
          projectId: +id,
          jobsName: item.name,
          eventType: newEvent || event,
          offsetOptions: {
            offset: 0,
            limit: batchSize,
          },
          timeOptions: {
            from: newStartDate ? +newStartDate : +fromDate,
            to: newEndDate ? +newEndDate : +toDate,
          },
        });
        if (count < batchSize) {
          setHasData((prevState) => ({
            ...prevState,
            hasMore: false,
            hasFollowing: true,
            hasPrevious: true,
          }));
        } else {
          setHasData((prevState) => ({
            ...prevState,
            hasMore: true,
            hasFollowing: true,
            hasPrevious: true,
          }));
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, jobId, event, fromDate, toDate, item, fromTestDate, executionData],
  );

  const handleDateChange = useCallback(
    (data: { newStartDate?: Date; newEndDate?: Date } = {}) => {
      setHasData({
        hasMore: true,
        hasPrevious: true,
        hasFollowing: true,
      });

      setOffset(0);

      handleRefreshData(data);

      const routeTo = type
        ? routeNames.jobs.executionsTypeAndFromAndTo
        : routeNames.jobs.executionsFromAndTo;

      const params = {
        type,
        from: data.newStartDate ? +data.newStartDate : +fromDate - 1,
        to: data.newEndDate ? +data.newEndDate : +toDate + 1,
        id,
        jobId,
      };

      navigate(
        getHrefNoMatching(routeTo, routeNames.project.value, true, params),
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [type, fromDate, toDate, id, jobId],
  );

  const handleEventChange = useCallback(
    (event: ExecutionsTypeSortOptions) => {
      setEvent(event);

      setHasData({
        hasMore: true,
        hasPrevious: true,
        hasFollowing: true,
      });

      setOffset(0);

      handleRefreshData({ newEvent: event });
      const newType = Object.entries(ExecutionsTypeSortOptions).find(
        ([_, value]) => value === event,
      );

      if (newType && newType[0]) {
        const params = {
          type: newType[0],
          from: from || +twentyEventDate,
          to: to || +new Date(),
          id,
          jobId,
        };

        navigate(
          getHrefNoMatching(
            routeNames.jobs.executionsTypeAndFromAndTo,
            routeNames.project.value,
            true,
            params,
          ),
        );
      }
    },
    [handleRefreshData, from, to, twentyEventDate, navigate, id, jobId],
  );

  const handleNavigate = useCallback(
    (jobId: number, route: string) => (): void => {
      navigate(
        getHrefNoMatching(route, routeNames.project.value, true, {
          id,
          jobId,
        }),
      );
    },
    [id, navigate],
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {!isLoading && !!item && !!item.executions.count && (
        <JobsExecutionsContent
          data={item}
          handleEdit={handleNavigate(+jobId, routeNames.jobs.edit)}
          handleRefreshData={handleRefreshData}
          setEvent={handleEventChange}
          handleDateChange={handleDateChange}
          event={event}
          startDate={fromDate}
          setStartDate={changeStartDate}
          setEndDate={changeEndDate}
          defaultFromDate={twentyEventDate}
          defaultToDate={new Date()}
          endDate={toDate}
          isLoading={isLoading}
          creationDate={dataAfterLoad}
          loadPrimaryExecutionsData={loadPrimaryExecutionsData}
        />
      )}
      {!isLoading && item && item.executions.count === 0 && (
        <NoData mainText="No executions available" />
      )}
    </>
  );
};

export default JobsExecutions;
