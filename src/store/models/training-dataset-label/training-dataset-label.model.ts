import { createModel } from '@rematch/core';
import { TrainingDatasetLabel } from '../../../types/training-dataset-label';
import { TrainingDatasetLabelService } from '../../../services/project';

export interface TrainingDatasetLabelsState {
  [key: number]: TrainingDatasetLabel[] | undefined;
}

const trainingDatasetLabelModel = createModel()({
  state: {} as TrainingDatasetLabelsState,
  reducers: {
    set: (
      state: TrainingDatasetLabelsState,
      payload: { id: number; data: TrainingDatasetLabel[] | undefined },
    ): TrainingDatasetLabelsState => ({
      ...state,
      [payload.id]: payload.data,
    }),
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
      const data = await new TrainingDatasetLabelService().getList(
        projectId,
        featureStoreId,
        trainingDatasetId,
      );

      dispatch.trainingDatasetLabels.set({
        id: trainingDatasetId,
        data,
      });
    },
    attachLabels: async ({
      projectId,
      featureStoreId,
      trainingDatasetId,
      data,
    }: {
      projectId: number;
      featureStoreId: number;
      trainingDatasetId: number;
      data: string[];
    }): Promise<void> => {
      await new TrainingDatasetLabelService().attachKeyword(
        projectId,
        featureStoreId,
        trainingDatasetId,
        data,
      );

      dispatch.trainingDatasetView.setLabels(data);
    },
  }),
});

export default trainingDatasetLabelModel;
