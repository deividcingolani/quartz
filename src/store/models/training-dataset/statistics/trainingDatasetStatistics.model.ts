import { createModel } from '@rematch/core';
import { normalize, schema } from 'normalizr';
import { FeatureGroupStatistics } from '../../../../types/feature-group';
import TrainingDatasetService from '../../../../services/project/TrainingDatasetService';

export type TrainingDatasetStatistics = {
  entities: {
    statistics: { [key: string]: FeatureGroupStatistics };
  };
  result: string[];
};

export type TrainingDatasetStatisticsState =
  | TrainingDatasetStatistics
  | { [key: string]: TrainingDatasetStatistics }
  | null;

const trainingDatasetStatisticsEntity =
  new schema.Entity<FeatureGroupStatistics>(
    'statistics',
    {},
    {
      idAttribute: 'column',
    },
  );

const trainingDatasetStatistics = createModel()({
  state: null as TrainingDatasetStatisticsState,
  reducers: {
    setData: (
      _: TrainingDatasetStatisticsState,
      payload: TrainingDatasetStatisticsState,
    ): TrainingDatasetStatisticsState => payload,
    clear: (): TrainingDatasetStatisticsState => null,
  },
  effects: (dispatch) => ({
    fetch: async ({
      projectId,
      featureStoreId,
      trainingDatasetId,
      timeCommit,
    }: {
      projectId: number;
      featureStoreId: number;
      trainingDatasetId: number;
      timeCommit?: string;
    }): Promise<void> => {
      const { data } = await TrainingDatasetService.getStatistics(
        projectId,
        featureStoreId,
        trainingDatasetId,
        timeCommit,
      );

      if (data.items) {
        const [item] = data.items;

        if (item.content) {
          // the training dataset is not split
          // the statistics are all in the content field
          const contentData: {
            columns: FeatureGroupStatistics[];
          } = JSON.parse(item.content) as {
            columns: FeatureGroupStatistics[];
          };

          const normalizedData = normalize<FeatureGroupStatistics>(
            contentData.columns,
            [trainingDatasetStatisticsEntity],
          );
          dispatch.trainingDatasetStatistics.setData(normalizedData);
        }

        if (item.splitStatistics) {
          // the training dataset has split
          // the statistics are collected by split
          // in the splitStatistics field
          const normalizedData = item.splitStatistics.map((split) => {
            const contentData: {
              columns: FeatureGroupStatistics[];
            } = JSON.parse(split.content) as {
              columns: FeatureGroupStatistics[];
            };

            const normalizedData = normalize<FeatureGroupStatistics>(
              contentData.columns,
              [trainingDatasetStatisticsEntity],
            ) as TrainingDatasetStatistics;

            return { splitName: split.name, statistics: normalizedData };
          });

          dispatch.trainingDatasetStatistics.setData(
            new Map(normalizedData.map((i) => [i.splitName, i.statistics])),
          );
        }
      }
    },
  }),
});

export default trainingDatasetStatistics;
