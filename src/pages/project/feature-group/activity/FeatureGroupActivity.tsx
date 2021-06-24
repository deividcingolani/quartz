import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

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
import useNavigateRelative from '../../../../hooks/useNavigateRelative';

const batchSize = 20;

const FeatureGroupActivity: FC = () => {
  const { id, fgId, type, to, from } = useParams();

  const navigate = useNavigateRelative();

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
      if (featureStoreData?.featurestoreId) {
        const count = await dispatch.featureGroupActivity.fetch({
          projectId: +id,
          featureGroupId: +fgId,
          featureStoreId: featureStoreData.featurestoreId,
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
    [id, fgId, dispatch, featureStoreData, event, fromDate, toDate],
  );

  const handleLoadPreviousData = useCallback(async () => {
    if (featureStoreData?.featurestoreId) {
      const { count, startDate } =
        await dispatch.featureGroupActivity.fetchPrevious({
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

      if (startDate > -1) {
        setFromDate(new Date(startDate - 1));

        navigate(
          `/${type ? 'type/' : ''}${startDate - 1}/${+toDate + 1}`,
          'p/:id/fg/:fgId/activity/*',
        );
      }
    }
  }, [
    id,
    type,
    fgId,
    event,
    hasData,
    toDate,
    navigate,
    minDate,
    dispatch,
    featureStoreData,
  ]);

  const handleLoadFollowingData = useCallback(async () => {
    if (featureStoreData?.featurestoreId) {
      const { count, endDate } =
        await dispatch.featureGroupActivity.fetchFollowing({
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
        setToDate(new Date(endDate + 1));

        navigate(
          `/${type ? 'type/' : ''}${+fromDate - 1}/${endDate + 1}`,
          'p/:id/fg/:fgId/activity/*',
        );
      }
    }
  }, [
    id,
    fgId,
    event,
    hasData,
    maxDate,
    fromDate,
    dispatch,
    featureStoreData,
    type,
    navigate,
  ]);

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
      const { count, startDate } =
        await dispatch.featureGroupActivity.fetchFirst({
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
  }, [id, fgId, event, offset, hasData, toDate, dispatch, featureStoreData]);

  const handleLoadWithTime = useCallback(async () => {
    if (featureStoreData?.featurestoreId) {
      await dispatch.featureGroupActivity.fetch({
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
          from: +fromDate,
        },
      });

      setOffset(offset + batchSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      navigate(
        `/${type ? `${type}/` : ''}${
          data.newStartDate ? +data.newStartDate : +fromDate - 1
        }/${data.newEndDate ? +data.newEndDate : +toDate + 1}`,
        'p/:id/fg/:fgId/activity/*',
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
      'p/:id/fg/:fgId/activity/*',
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
          'p/:id/fg/:fgId/activity/*',
        );
      }
    },
    [handleRefreshData, navigate, from, to, twentyEventDate],
  );

  useInfinityLoad(loader, content, isLoadingMore, handleLoadMore);

  useEffect(() => {
    if (featureStoreData?.featurestoreId) {
      dispatch.featureGroupView.fetch({
        projectId: +id,
        featureGroupId: +fgId,
        featureStoreId: featureStoreData.featurestoreId,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id, fgId, featureStoreData]);

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

export default FeatureGroupActivity;
