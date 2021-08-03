// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Components
import Loader from '../../../../components/loader/Loader';
import TrainingDatasetActivityContent from './TrainingDatasetActivityContent';
// Types
import { ActivityTypeSortOptions } from './types';
import { Dispatch, RootState } from '../../../../store';
// Selectors
import {
  selectTrainingDatasetActivity,
  selectTrainingDatasetActivityFirstFetchLoading,
  selectTrainingDatasetActivityLoading,
  selectTrainingDatasetActivityLoadingMore,
} from '../../../../store/models/training-dataset/activity/selectors';
// Hooks
import useTitle from '../../../../hooks/useTitle';
import useFirstLoad from '../../../../hooks/useFirstLoad';
import useInfinityLoad from '../../../../hooks/useInfinityLoad';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
// Context
import { ContentContext } from '../../../../layouts/app/AppLayout';
// Utils
import { getMaxDate, getMinDate } from '../../feature-group/utils';

import titles from '../../../../sources/titles';

const batchSize = 20;

const TrainingDatasetActivity: FC = () => {
  const { id, fsId, tdId, type, to, from } = useParams();

  const navigate = useNavigateRelative();

  const { current: content } = useContext(ContentContext);
  const loader = useRef<HTMLButtonElement>(null);

  const dispatch = useDispatch<Dispatch>();

  const isLoadingMore = useSelector(selectTrainingDatasetActivityLoadingMore);

  const activity = useSelector(selectTrainingDatasetActivity);

  const minDate = useMemo(() => getMinDate(activity), [activity]);
  const maxDate = useMemo(() => getMaxDate(activity), [activity]);

  const view = useSelector((state: RootState) => state.trainingDatasetView);

  const creationDate = useFirstLoad<string | undefined>(view?.created);

  const [twentyEventDate, setDateOfTwentyEvent] = useState(new Date());

  const [fromDate, setFromDate] = useState(from ? new Date(+from) : new Date());
  const [toDate, setToDate] = useState(to ? new Date(+to) : new Date());

  const eventType = Object.keys(ActivityTypeSortOptions).includes(type)
    ? ActivityTypeSortOptions[type as keyof typeof ActivityTypeSortOptions]
    : ActivityTypeSortOptions.ALL;

  const [event, setEvent] = useState<ActivityTypeSortOptions>(eventType);

  const [offset, setOffset] = useState(0);

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
        newEvent?: ActivityTypeSortOptions;
      } = {},
    ) => {
      const { newEndDate, newStartDate, newEvent } = data;

      const count = await dispatch.trainingDatasetActivity.fetch({
        projectId: +id,
        trainingDatasetId: +tdId,
        featureStoreId: +fsId,
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
    },
    [id, tdId, dispatch, fsId, event, fromDate, toDate],
  );

  const handleLoadPreviousData = useCallback(async () => {
    const { count, startDate } =
      await dispatch.trainingDatasetActivity.fetchPrevious({
        projectId: +id,
        trainingDatasetId: +tdId,
        featureStoreId: +fsId,
        eventType: event,
        offsetOptions: {
          limit: batchSize,
          offset: 0,
        },
        timeOptions: {
          to: minDate - 1,
        },
      });

    if (count < batchSize) {
      setHasData({
        ...hasData,
        hasPrevious: false,
      });
    }

    if (startDate > -1) {
      setFromDate(new Date(startDate - 1));

      navigate(
        `/${type ? 'type/' : ''}${startDate - 1}/${+toDate + 1}`,
        'p/:id/fs/:fsIdfg/:tdId/activity/*',
      );
    }
  }, [
    id,
    type,
    tdId,
    event,
    hasData,
    toDate,
    navigate,
    minDate,
    dispatch,
    fsId,
  ]);

  const handleLoadFollowingData = useCallback(async () => {
    const { count, endDate } =
      await dispatch.trainingDatasetActivity.fetchFollowing({
        projectId: +id,
        trainingDatasetId: +tdId,
        featureStoreId: +fsId,
        eventType: event,
        offsetOptions: {
          limit: batchSize,
          offset: 0,
        },
        timeOptions: {
          from: maxDate + 1,
        },
        sortType: 'asc',
      });

    if (count < batchSize) {
      setHasData({
        ...hasData,
        hasFollowing: false,
      });
    }

    if (endDate > -1) {
      setToDate(new Date(endDate + 1));

      navigate(
        `/${type ? 'type/' : ''}${+fromDate - 1}/${endDate + 1}`,
        'p/:id/fs/:fsId/fg/:tdId/activity/*',
      );
    }
  }, [
    id,
    tdId,
    event,
    hasData,
    maxDate,
    fromDate,
    dispatch,
    fsId,
    type,
    navigate,
  ]);

  const handleLoadMore = useCallback(async () => {
    if (hasData.hasMore) {
      const count = await dispatch.trainingDatasetActivity.fetchMore({
        projectId: +id,
        trainingDatasetId: +tdId,
        featureStoreId: +fsId,
        eventType: event,
        offsetOptions: {
          limit: batchSize,
          offset: offset + batchSize,
        },
        timeOptions: {
          from: +fromDate,
          to: +toDate,
        },
      });

      if (count < batchSize) {
        setHasData({
          ...hasData,
          hasMore: false,
        });
      }

      setOffset(offset + batchSize);
    }
  }, [id, tdId, event, offset, hasData, toDate, dispatch, fromDate, fsId]);

  const handleLoadFirst = useCallback(async () => {
    if (hasData.hasMore) {
      const { count, startDate } =
        await dispatch.trainingDatasetActivity.fetchFirst({
          projectId: +id,
          trainingDatasetId: +tdId,
          featureStoreId: +fsId,
          eventType: event,
          offsetOptions: {
            limit: batchSize,
            offset: 0,
          },
          timeOptions: {
            to: +toDate,
          },
          sortType: 'desc',
        });

      if (startDate > 0) {
        setFromDate(new Date(startDate - 1));
        setDateOfTwentyEvent(new Date(startDate - 1));
      }

      if (count < batchSize) {
        setHasData({
          ...hasData,
          hasPrevious: false,
          hasMore: false,
        });
      }

      setOffset(offset + batchSize);
    }
  }, [id, tdId, event, offset, hasData, toDate, dispatch, fsId]);

  const handleLoadWithTime = useCallback(async () => {
    await dispatch.trainingDatasetActivity.fetch({
      projectId: +id,
      trainingDatasetId: +tdId,
      featureStoreId: +fsId,
      eventType: event,
      offsetOptions: {
        limit: batchSize,
        offset: 0,
      },
      timeOptions: {
        to: +toDate,
        from: +fromDate,
      },
    });

    setOffset(offset + batchSize);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, tdId, event, offset, hasData, toDate, dispatch, fsId]);

  const handleDateChange = useCallback(
    (data: { newStartDate?: Date; newEndDate?: Date } = {}) => {
      setHasData({
        hasMore: true,
        hasPrevious: true,
        hasFollowing: true,
      });

      setOffset(0);

      handleRefreshData(data);

      navigate(
        `/${type ? `${type}/` : ''}${
          data.newStartDate ? +data.newStartDate : +fromDate - 1
        }/${data.newEndDate ? +data.newEndDate : +toDate + 1}`,
        'p/:id/fs/:fsId/fg/:tdId/activity/*',
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigate, type, fromDate, toDate],
  );

  const handleResetFilters = useCallback(() => {
    setEvent(ActivityTypeSortOptions.ALL);

    setToDate(new Date());

    if (!!from && creationDate) {
      setFromDate(new Date(creationDate));
    } else {
      setFromDate(twentyEventDate);
    }

    handleRefreshData({
      newEndDate: new Date(),
      newStartDate:
        !!from && creationDate ? new Date(creationDate) : twentyEventDate,
    });

    navigate(
      `/${type ? `${type}/` : ''}${+(!!from && creationDate
        ? new Date(creationDate)
        : twentyEventDate)}/${+new Date()}`,
      'p/:id/fs/:fsId/fg/:tdId/activity/*',
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [twentyEventDate, creationDate, navigate]);

  const handleEventChange = useCallback(
    (event: ActivityTypeSortOptions) => {
      setEvent(event);

      setHasData({
        hasMore: true,
        hasPrevious: true,
        hasFollowing: true,
      });

      setOffset(0);

      handleRefreshData({ newEvent: event });
      const newType = Object.entries(ActivityTypeSortOptions).find(
        ([_, value]) => value === event,
      );

      if (newType && newType[0]) {
        navigate(
          `/${newType[0]}/${from || +twentyEventDate}/${to || +new Date()}`,
          'p/:id/fs/:fsId/fg/:tdId/activity/*',
        );
      }
    },
    [handleRefreshData, navigate, from, to, twentyEventDate],
  );

  useInfinityLoad(loader, content, isLoadingMore, handleLoadMore);

  useEffect(() => {
    dispatch.trainingDatasetView.fetch({
      projectId: +id,
      trainingDatasetId: +tdId,
      featureStoreId: +fsId,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id, tdId, fsId]);

  useEffect(() => {
    if (!from && !to) {
      handleLoadFirst();
    } else {
      handleLoadWithTime();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLoading = useSelector(
    (state: RootState) => state.loading.effects.featureGroupView.fetch,
  );
  const isLoadingActivity = useSelector(selectTrainingDatasetActivityLoading);
  const isLoadingActivityFirstTime = useSelector(
    selectTrainingDatasetActivityFirstFetchLoading,
  );

  useTitle(`${titles.activity} ${view?.name ? view.name : ''}`);

  if (isLoading || isLoadingActivityFirstTime || !view || !creationDate) {
    return <Loader />;
  }

  return (
    <TrainingDatasetActivityContent
      view={view}
      event={event}
      hasData={hasData}
      endDate={toDate}
      loaderRef={loader}
      activity={activity}
      startDate={fromDate}
      setEndDate={setToDate}
      setStartDate={setFromDate}
      setEvent={handleEventChange}
      creationDate={creationDate}
      isLoading={isLoadingActivity}
      defaultFromDate={twentyEventDate}
      defaultToDate={new Date()}
      onResetFilters={handleResetFilters}
      handleDateChange={handleDateChange}
      handleRefreshData={handleRefreshData}
      handleLoadPreviousData={handleLoadPreviousData}
      handleLoadFollowingData={handleLoadFollowingData}
    />
  );
};

export default TrainingDatasetActivity;
