import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
// Components
import Loader from '../../../../components/loader/Loader';
import FeatureGroupActivityContent from './FeatureGroupActivityContent';
// Types
import { ActivityTypeSortOptions } from './types';
import { Dispatch, RootState } from '../../../../store';
import { FeatureGroupViewState } from '../../../../store/models/feature/featureGroupView.model';
// Selectors
import { selectFeatureStoreData } from '../../../../store/models/feature/selectors';
import {
  selectFeatureGroupActivity,
  selectFeatureGroupActivityFirstFetchLoading,
  selectFeatureGroupActivityLoading,
  selectFeatureGroupActivityLoadingMore,
} from '../../../../store/models/feature/activity/selectors';
// Hooks
import useFirstLoad from '../../../../hooks/useFirstLoad';
import useInfinityLoad from '../../../../hooks/useInfinityLoad';
// Context
import { ContentContext } from '../../../../layouts/app/AppLayout';
// Utils
import { getMaxDate, getMinDate } from '../utils';
import useTitle from '../../../../hooks/useTitle';
import titles from '../../../../sources/titles';

const batchSize = 20;

const FeatureGroupActivity: FC = () => {
  const { id, fgId } = useParams();

  const { current: content } = useContext(ContentContext);
  const loader = useRef<HTMLButtonElement>(null);

  const dispatch = useDispatch<Dispatch>();

  const { data: featureStoreData } = useSelector(selectFeatureStoreData);
  const isLoadingMore = useSelector(selectFeatureGroupActivityLoadingMore);

  const activity = useSelector(selectFeatureGroupActivity);

  const minDate = useMemo(() => getMinDate(activity), [activity]);
  const maxDate = useMemo(() => getMaxDate(activity), [activity]);

  const view = useSelector<RootState, FeatureGroupViewState>(
    (state) => state.featureGroupView,
  );

  const creationDate = useFirstLoad<string | undefined>(view?.created);

  const [twentyEventDate, setDateOfTwentyEvent] = useState(new Date());

  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());

  const [event, setEvent] = useState<ActivityTypeSortOptions>(
    ActivityTypeSortOptions.ALL,
  );

  const [offset, setOffset] = useState(0);

  const [hasData, setHasData] = useState({
    hasMore: true,
    hasPrevious: true,
    hasFollowing: false,
  });

  const handleRefreshData = useCallback(
    async (data: { newStartDate?: Date; newEndDate?: Date } = {}) => {
      const { newEndDate, newStartDate } = data;

      if (featureStoreData?.featurestoreId) {
        const count = await dispatch.featureGroupActivity.fetch({
          projectId: +id,
          featureGroupId: +fgId,
          featureStoreId: featureStoreData.featurestoreId,
          eventType: event,
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
    [id, fgId, dispatch, featureStoreData, event, fromDate, toDate],
  );

  const handleLoadPreviousData = useCallback(async () => {
    if (featureStoreData?.featurestoreId) {
      const {
        count,
        startDate,
      } = await dispatch.featureGroupActivity.fetchPrevious({
        projectId: +id,
        featureGroupId: +fgId,
        featureStoreId: featureStoreData.featurestoreId,
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

      if (startDate > 0) {
        setFromDate(new Date(startDate));
      }
    }
  }, [id, fgId, event, hasData, minDate, dispatch, featureStoreData]);

  const handleLoadFollowingData = useCallback(async () => {
    if (featureStoreData?.featurestoreId) {
      const {
        count,
        endDate,
      } = await dispatch.featureGroupActivity.fetchFollowing({
        projectId: +id,
        featureGroupId: +fgId,
        featureStoreId: featureStoreData.featurestoreId,
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
        setToDate(new Date(endDate));
      }
    }
  }, [id, fgId, event, hasData, maxDate, dispatch, featureStoreData]);

  const handleLoadMore = useCallback(async () => {
    if (featureStoreData?.featurestoreId && hasData.hasMore) {
      const count = await dispatch.featureGroupActivity.fetchMore({
        projectId: +id,
        featureGroupId: +fgId,
        featureStoreId: featureStoreData.featurestoreId,
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
  }, [
    id,
    fgId,
    event,
    offset,
    hasData,
    toDate,
    dispatch,
    fromDate,
    featureStoreData,
  ]);

  const handleLoadFirst = useCallback(async () => {
    if (featureStoreData?.featurestoreId && hasData.hasMore) {
      const {
        count,
        startDate,
      } = await dispatch.featureGroupActivity.fetchFirst({
        projectId: +id,
        featureGroupId: +fgId,
        featureStoreId: featureStoreData.featurestoreId,
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
        setFromDate(new Date(startDate));
        setDateOfTwentyEvent(new Date(startDate));
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
  }, [id, fgId, event, offset, hasData, toDate, dispatch, featureStoreData]);

  const handleDateChange = useCallback(
    (data: { newStartDate?: Date; newEndDate?: Date } = {}) => {
      setHasData({
        hasMore: true,
        hasPrevious: true,
        hasFollowing: true,
      });

      setOffset(0);

      handleRefreshData(data);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleResetFilters = useCallback(() => {
    setEvent(ActivityTypeSortOptions.ALL);

    setToDate(new Date());

    setFromDate(twentyEventDate);

    handleRefreshData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [twentyEventDate]);

  useInfinityLoad(loader, content, isLoadingMore, handleLoadMore);

  useEffect(() => {
    if (featureStoreData?.featurestoreId) {
      dispatch.featureGroups.fetch({
        projectId: +id,
        featureStoreId: featureStoreData.featurestoreId,
      });
      dispatch.featureGroupView.fetch({
        projectId: +id,
        featureGroupId: +fgId,
        featureStoreId: featureStoreData.featurestoreId,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id, fgId, featureStoreData]);

  useEffect(() => {
    handleLoadFirst();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setHasData({
      hasMore: true,
      hasPrevious: true,
      hasFollowing: true,
    });

    setOffset(0);

    handleRefreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  const isLoading = useSelector(
    (state: RootState) => state.loading.effects.featureGroupView.fetch,
  );
  const isLoadingActivity = useSelector(selectFeatureGroupActivityLoading);
  const isLoadingActivityFirstTime = useSelector(
    selectFeatureGroupActivityFirstFetchLoading,
  );

  useTitle(`${titles.activity} ${view?.name ? view.name : ''}`);

  if (isLoading || isLoadingActivityFirstTime || !view || !creationDate) {
    return <Loader />;
  }

  return (
    <FeatureGroupActivityContent
      view={view}
      event={event}
      hasData={hasData}
      endDate={toDate}
      loaderRef={loader}
      activity={activity}
      setEvent={setEvent}
      startDate={fromDate}
      setEndDate={setToDate}
      setStartDate={setFromDate}
      creationDate={creationDate}
      isLoading={isLoadingActivity}
      onResetFilters={handleResetFilters}
      handleDateChange={handleDateChange}
      handleRefreshData={handleRefreshData}
      handleLoadPreviousData={handleLoadPreviousData}
      handleLoadFollowingData={handleLoadFollowingData}
    />
  );
};

export default FeatureGroupActivity;
