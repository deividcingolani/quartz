import { format } from 'date-fns';
import { createModel } from '@rematch/core';
import {
  ActivityItem,
  ActivityItemData,
} from '../../../../types/feature-group';
import FeatureGroupsService from '../../../../services/project/FeatureGroupsService';
import { ActivityTypeSortOptions } from '../../../../pages/project/feature-group/activity/types';

export type FeatureGroupActivityState = ActivityItem;

export interface ActivityFetchParams {
  projectId: number;
  featureStoreId: number;
  featureGroupId: number;
  eventType: ActivityTypeSortOptions;
  timeOptions?: {
    from?: number;
    to?: number;
  };
  offsetOptions?: {
    limit?: number;
    offset: number;
  };
  sortType?: 'asc' | 'desc';
}

const mapData = (payload: ActivityItemData[], beginValue = {}) => {
  const data = payload.reduce(
    (acc: { [time: string]: ActivityItemData[] }, item) => {
      const stringDate = format(+item.timestamp, 'dd MMM. y');
      if (!acc[stringDate]) {
        acc[stringDate] = [];
      }

      acc[stringDate].push(item);

      return acc;
    },
    beginValue,
  );

  return Object.keys(data).reduce((acc, key) => {
    return {
      ...acc,
      [key]: data[key].sort(
        (itemA, itemB) => -Math.sign(itemA.timestamp - itemB.timestamp),
      ),
    };
  }, {});
};

const featureGroupActivity = createModel()({
  state: {} as FeatureGroupActivityState,
  reducers: {
    setData: (
      _: FeatureGroupActivityState,
      payload: FeatureGroupActivityState,
    ): FeatureGroupActivityState => payload,
    setMoreData: (
      prevState: FeatureGroupActivityState,
      payload: ActivityItemData[],
    ): FeatureGroupActivityState => {
      const copy = JSON.parse(JSON.stringify(prevState));

      return mapData(payload, copy);
    },
    setFollowingData: (
      prevState: FeatureGroupActivityState,
      payload: ActivityItemData[],
    ): FeatureGroupActivityState => {
      const calculated = mapData(payload);

      return { ...calculated, ...prevState };
    },
    clear: (): FeatureGroupActivityState => ({}),
  },
  effects: (dispatch) => ({
    fetch: async ({
      projectId,
      featureStoreId,
      featureGroupId,
      eventType,
      timeOptions,
      offsetOptions,
    }: ActivityFetchParams): Promise<number> => {
      const { data } = await FeatureGroupsService.getActivity(
        projectId,
        featureStoreId,
        featureGroupId,
        eventType,
        timeOptions,
        offsetOptions,
      );

      const { items = [] } = data;

      const groupedItems = mapData(items);

      dispatch.featureGroupActivity.setData(groupedItems);

      return items.length;
    },
    fetchFirst: async ({
      projectId,
      featureStoreId,
      featureGroupId,
      eventType,
      timeOptions,
      offsetOptions,
      sortType,
    }: ActivityFetchParams): Promise<{
      count: number;
      startDate: number;
    }> => {
      const { data } = await FeatureGroupsService.getActivity(
        projectId,
        featureStoreId,
        featureGroupId,
        eventType,
        timeOptions,
        offsetOptions,
        sortType,
      );

      const { items = [] } = data;

      const groupedItems = mapData(items);

      dispatch.featureGroupActivity.setData(groupedItems);

      return {
        count: items.length,
        startDate: items.length
          ? Math.min(...items.map(({ timestamp }) => timestamp))
          : -1,
      };
    },
    fetchMore: async ({
      projectId,
      featureStoreId,
      featureGroupId,
      eventType,
      timeOptions,
      offsetOptions,
    }: ActivityFetchParams): Promise<number> => {
      const { data } = await FeatureGroupsService.getActivity(
        projectId,
        featureStoreId,
        featureGroupId,
        eventType,
        timeOptions,
        offsetOptions,
      );

      const { items = [] } = data;

      dispatch.featureGroupActivity.setMoreData(items);

      return items.length;
    },
    fetchPrevious: async ({
      projectId,
      featureStoreId,
      featureGroupId,
      eventType,
      timeOptions,
      offsetOptions,
    }: ActivityFetchParams): Promise<{
      count: number;
      startDate: number;
    }> => {
      const { data } = await FeatureGroupsService.getActivity(
        projectId,
        featureStoreId,
        featureGroupId,
        eventType,
        timeOptions,
        offsetOptions,
      );

      const { items = [] } = data;

      dispatch.featureGroupActivity.setMoreData(items);

      return {
        count: items.length,
        startDate: items.length
          ? Math.min(...items.map(({ timestamp }) => timestamp))
          : -1,
      };
    },
    fetchFollowing: async ({
      projectId,
      featureStoreId,
      featureGroupId,
      eventType,
      timeOptions,
      offsetOptions,
      sortType,
    }: ActivityFetchParams): Promise<{
      count: number;
      endDate: number;
    }> => {
      const { data } = await FeatureGroupsService.getActivity(
        projectId,
        featureStoreId,
        featureGroupId,
        eventType,
        timeOptions,
        offsetOptions,
        sortType,
      );

      const { items = [] } = data;

      items.reverse();

      dispatch.featureGroupActivity.setFollowingData(items);

      return {
        count: items.length,
        endDate: items.length
          ? Math.max(...items.map(({ timestamp }) => timestamp))
          : -1,
      };
    },
  }),
});

export default featureGroupActivity;
