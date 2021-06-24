import { format } from 'date-fns';
import { createModel } from '@rematch/core';
import {
  ActivityItem,
  ActivityItemData,
} from '../../../../types/feature-group';
import { ActivityTypeSortOptions } from '../../../../pages/project/training-dataset/activity/types';
import TrainingDatasetService from '../../../../services/project/TrainingDatasetService';

export type TrainingDatasetActivityState = ActivityItem;

export interface ActivityFetchParams {
  projectId: number;
  featureStoreId: number;
  trainingDatasetId: number;
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

const trainingDatasetActivity = createModel()({
  state: {} as TrainingDatasetActivityState,
  reducers: {
    setData: (
      _: TrainingDatasetActivityState,
      payload: TrainingDatasetActivityState,
    ): TrainingDatasetActivityState => payload,
    setMoreData: (
      prevState: TrainingDatasetActivityState,
      payload: ActivityItemData[],
    ): TrainingDatasetActivityState => {
      const copy = JSON.parse(JSON.stringify(prevState));

      return mapData(payload, copy);
    },
    setFollowingData: (
      prevState: TrainingDatasetActivityState,
      payload: ActivityItemData[],
    ): TrainingDatasetActivityState => {
      const calculated = mapData(payload);

      return { ...calculated, ...prevState };
    },
    clear: (): TrainingDatasetActivityState => ({}),
  },
  effects: (dispatch) => ({
    fetch: async ({
      projectId,
      featureStoreId,
      trainingDatasetId,
      eventType,
      timeOptions,
      offsetOptions,
    }: ActivityFetchParams): Promise<number> => {
      const { data } = await TrainingDatasetService.getActivity(
        projectId,
        featureStoreId,
        trainingDatasetId,
        eventType,
        timeOptions,
        offsetOptions,
      );

      const { items = [] } = data;

      const groupedItems = mapData(items);

      dispatch.trainingDatasetActivity.setData(groupedItems);

      return items.length;
    },
    fetchFirst: async ({
      projectId,
      featureStoreId,
      trainingDatasetId,
      eventType,
      timeOptions,
      offsetOptions,
      sortType,
    }: ActivityFetchParams): Promise<{
      count: number;
      startDate: number;
    }> => {
      const { data } = await TrainingDatasetService.getActivity(
        projectId,
        featureStoreId,
        trainingDatasetId,
        eventType,
        timeOptions,
        offsetOptions,
        sortType,
      );

      const { items = [] } = data;

      const groupedItems = mapData(items);

      dispatch.trainingDatasetActivity.setData(groupedItems);

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
      trainingDatasetId,
      eventType,
      timeOptions,
      offsetOptions,
    }: ActivityFetchParams): Promise<number> => {
      const { data } = await TrainingDatasetService.getActivity(
        projectId,
        featureStoreId,
        trainingDatasetId,
        eventType,
        timeOptions,
        offsetOptions,
      );

      const { items = [] } = data;

      dispatch.trainingDatasetActivity.setMoreData(items);

      return items.length;
    },
    fetchPrevious: async ({
      projectId,
      featureStoreId,
      trainingDatasetId,
      eventType,
      timeOptions,
      offsetOptions,
    }: ActivityFetchParams): Promise<{
      count: number;
      startDate: number;
    }> => {
      const { data } = await TrainingDatasetService.getActivity(
        projectId,
        featureStoreId,
        trainingDatasetId,
        eventType,
        timeOptions,
        offsetOptions,
      );

      const { items = [] } = data;

      dispatch.trainingDatasetActivity.setMoreData(items);

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
      trainingDatasetId,
      eventType,
      timeOptions,
      offsetOptions,
      sortType,
    }: ActivityFetchParams): Promise<{
      count: number;
      endDate: number;
    }> => {
      const { data } = await TrainingDatasetService.getActivity(
        projectId,
        featureStoreId,
        trainingDatasetId,
        eventType,
        timeOptions,
        offsetOptions,
        sortType,
      );

      const { items = [] } = data;

      items.reverse();

      dispatch.trainingDatasetActivity.setFollowingData(items);

      return {
        count: items.length,
        endDate: items.length
          ? Math.max(...items.map(({ timestamp }) => timestamp))
          : -1,
      };
    },
  }),
});

export default trainingDatasetActivity;
