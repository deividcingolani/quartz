import { useNavigate, useParams } from 'react-router-dom';
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
import routeNames from '../../../../routes/routeNames';
import getHrefNoMatching from '../../../../utils/getHrefNoMatching';

const batchSize = 20;

const FeatureGroupActivity: FC = () => {
  const { id, fsId, fgId, type, to, from } = useParams();

  const navigate = useNavigate();

  const { current: content } = useContext(ContentContext);
  const loader = useRef<HTMLButtonElement>(null);

  const dispatch = useDispatch<Dispatch>();

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
      const count = await dispatch.featureGroupActivity.fetch({
        projectId: +id,
        featureGroupId: +fgId,
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
    [dispatch.featureGroupActivity, id, fgId, fsId, event, fromDate, toDate],
  );

  const handleLoadPreviousData = useCallback(async () => {
    const { count, startDate } =
      await dispatch.featureGroupActivity.fetchPrevious({
        projectId: +id,
        featureGroupId: +fgId,
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

      const route = type
        ? routeNames.featureGroup.activityTypeAndFromAndTo
        : routeNames.featureGroup.activityFromAndTo;

      const params = {
        type,
        id,
        fsId,
        fgId,
        from: startDate - 1,
        to: +toDate + 1,
      };
      navigate(
        getHrefNoMatching(route, routeNames.project.value, true, params),
      );
      // `p/:id/fs/:fsId/fg/:fgId/activity/${type || ''}${startDate - 1}/${+toDate + 1}`;
    }
  }, [
    dispatch.featureGroupActivity,
    id,
    fgId,
    fsId,
    event,
    minDate,
    hasData,
    navigate,
    type,
    toDate,
  ]);

  const handleLoadFollowingData = useCallback(async () => {
    const { count, endDate } =
      await dispatch.featureGroupActivity.fetchFollowing({
        projectId: +id,
        featureGroupId: +fgId,
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

      const route = type
        ? routeNames.featureGroup.activityTypeAndFromAndTo
        : routeNames.featureGroup.activityFromAndTo;

      const params = {
        type,
        id,
        fsId,
        fgId,
        from: +fromDate - 1,
        to: endDate + 1,
      };
      navigate(
        getHrefNoMatching(route, routeNames.project.value, true, params),
      );
    }
  }, [
    dispatch.featureGroupActivity,
    id,
    fgId,
    fsId,
    event,
    maxDate,
    hasData,
    navigate,
    type,
    fromDate,
  ]);

  const handleLoadMore = useCallback(async () => {
    if (hasData.hasMore) {
      const count = await dispatch.featureGroupActivity.fetchMore({
        projectId: +id,
        featureGroupId: +fgId,
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
  }, [
    hasData,
    dispatch.featureGroupActivity,
    id,
    fgId,
    fsId,
    event,
    offset,
    fromDate,
    toDate,
  ]);

  const handleLoadFirst = useCallback(async () => {
    if (hasData.hasMore) {
      const { count, startDate } =
        await dispatch.featureGroupActivity.fetchFirst({
          projectId: +id,
          featureGroupId: +fgId,
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
  }, [
    hasData,
    dispatch.featureGroupActivity,
    id,
    fgId,
    fsId,
    event,
    toDate,
    offset,
  ]);

  const handleLoadWithTime = useCallback(async () => {
    await dispatch.featureGroupActivity.fetch({
      projectId: +id,
      featureGroupId: +fgId,
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
  }, [id, fsId, fgId, event, offset, hasData, toDate, dispatch]);

  const handleDateChange = useCallback(
    (data: { newStartDate?: Date; newEndDate?: Date } = {}) => {
      setHasData({
        hasMore: true,
        hasPrevious: true,
        hasFollowing: true,
      });

      setOffset(0);

      handleRefreshData(data);

      const route = type
        ? routeNames.featureGroup.activityTypeAndFromAndTo
        : routeNames.featureGroup.activityFromAndTo;

      const params = {
        type,
        id,
        fsId,
        fgId,
        from: data.newStartDate ? +data.newStartDate : +fromDate - 1,
        to: data.newEndDate ? +data.newEndDate : +toDate + 1,
      };
      navigate(
        getHrefNoMatching(route, routeNames.project.value, true, params),
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

    const route = type
      ? routeNames.featureGroup.activityTypeAndFromAndTo
      : routeNames.featureGroup.activityFromAndTo;

    const params = {
      type,
      id,
      fsId,
      fgId,
      from: +(!!from && creationDate
        ? new Date(creationDate)
        : twentyEventDate),
      to: +new Date(),
    };
    navigate(getHrefNoMatching(route, routeNames.project.value, true, params));
  }, [
    fgId,
    id,
    from,
    handleRefreshData,
    type,
    fsId,
    twentyEventDate,
    creationDate,
    navigate,
  ]);

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
        const params = {
          type: newType[0],
          id,
          fsId,
          fgId,
          from: from || +twentyEventDate,
          to: to || +new Date(),
        };
        navigate(
          getHrefNoMatching(
            routeNames.featureGroup.activityTypeAndFromAndTo,
            routeNames.project.value,
            true,
            params,
          ),
        );
      }
    },
    [fsId, fgId, id, handleRefreshData, navigate, from, to, twentyEventDate],
  );

  useInfinityLoad(loader, content, isLoadingMore, handleLoadMore);

  useEffect(() => {
    dispatch.featureGroupView.fetch({
      projectId: +id,
      featureGroupId: +fgId,
      featureStoreId: +fsId,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id, fgId, fsId]);

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
