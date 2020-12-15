import { createModel } from '@rematch/core';
import { TrainingDataset } from '../../../types/training-dataset';
import TrainingDatasetService from '../../../services/project/TrainingDatasetService';

export type TrainingDatasetState = TrainingDataset[];

export const trainingDatasetModel = createModel()({
  state: [] as TrainingDatasetState,
  reducers: {
    set: (
      _: TrainingDatasetState,
      payload: TrainingDataset[],
    ): TrainingDatasetState => payload,
  },
  effects: (dispatch) => ({
    fetch: async ({
      projectId,
      featureStoreId,
    }: {
      projectId: number;
      featureStoreId: number;
    }): Promise<void> => {
      const data = await TrainingDatasetService.getList(
        +projectId,
        +featureStoreId,
      );

      data.forEach(({ id }) => {
        dispatch.trainingDatasetLabels.fetch({
          projectId,
          featureStoreId,
          trainingDatasetId: id,
        });
      });

      dispatch.trainingDatasets.set(data);
    },
  }),
});
