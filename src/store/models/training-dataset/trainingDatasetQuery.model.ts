import { createModel } from '@rematch/core';
import TrainingDatasetService from '../../../services/project/TrainingDatasetService';
import { TrainingDatasetQuery } from '../../../types/training-dataset';

export type TrainingDatasetQueryState = TrainingDatasetQuery | null;

const trainingDatasetQuery = createModel()({
  state: null as TrainingDatasetQueryState,
  reducers: {
    setData: (
      _: TrainingDatasetQueryState,
      payload: TrainingDatasetQueryState,
    ): TrainingDatasetQueryState => payload,
    clear: (): TrainingDatasetQueryState => null,
  },
  effects: (dispatch) => ({
    fetch: async ({
      projectId,
      featureStoreId,
      trainingDatasetId,
    }: {
      projectId: number;
      featureStoreId: number;
      trainingDatasetId: number;
    }): Promise<void> => {
      const data = await TrainingDatasetService.getQuery(
        projectId,
        featureStoreId,
        trainingDatasetId,
      ).catch((err) => {
        if (err.response?.data?.errorCode) {
          if (err.response.data.errorCode === 270111) {
            return null;
          }
        }
        throw err;
      });

      dispatch.trainingDatasetQuery.setData(data);
    },
  }),
});

export default trainingDatasetQuery;
