import { createModel } from '@rematch/core';
import { normalize, schema } from 'normalizr';
import { FeatureGroupStatistics } from '../../../../types/feature-group';
import TrainingDatasetService from '../../../../services/project/TrainingDatasetService';

export type TrainingDatasetStatisticsState = {
  entities: {
    statistics: { [key: string]: FeatureGroupStatistics };
  };
  result: string[];
} | null;

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
    },
  }),
});

export default trainingDatasetStatistics;
