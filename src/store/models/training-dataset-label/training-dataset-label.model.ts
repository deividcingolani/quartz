import { createModel, RematchDispatch } from '@rematch/core';
import { ITrainingDatasetLabel } from '../../../types/training-dataset-label';
import { RootModel } from '../index';
import * as types from './types';
import { TrainingDatasetLabelService } from '../../../services/project/training-dataset-labels.service';

const initialState: types.ITrainingDatasetLabelsState = {};

export const trainingDatasetLabelModel = createModel<RootModel>()({
  state: initialState,
  reducers: {
    set: (
      state,
      payload: { id: number; data: ITrainingDatasetLabel[] | undefined },
    ): types.ITrainingDatasetLabelsState => ({
      ...state,
      [payload.id]: payload.data,
    }),
    clear: () => initialState,
  },
  effects: (dispatch) => ({
    fetch: fetch(dispatch),
  }),
});

const fetch = (dispatch: RematchDispatch<RootModel>) => async ({
  projectId,
  featureStoreId,
  trainingDatasetId,
}: {
  projectId: number;
  featureStoreId: number;
  trainingDatasetId: number;
}): Promise<void> => {
  const { data } = await new TrainingDatasetLabelService().getList(
    projectId,
    featureStoreId,
    trainingDatasetId,
  );

  dispatch.trainingDatasetLabels.set({
    id: trainingDatasetId,
    data: data.items,
  });
};
