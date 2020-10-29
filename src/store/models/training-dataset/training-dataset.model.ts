import { createModel, RematchDispatch } from '@rematch/core';
import { TrainingDatasetService } from '../../../services/project';
import { RootModel } from '../index';
import { ITrainingDataset } from '../../../types/training-dataset';
import * as types from './types';

const initialState: types.TrainingDatasetState = [];

export const trainingDatasetModel = createModel<RootModel>()({
  state: initialState,
  reducers: {
    set: (s, p: ITrainingDataset[]): types.TrainingDatasetState => p,
    clear: () => initialState,
  },
  effects: (dispatch) => ({
    fetch: fetch(dispatch),
  }),
});

const fetch = (dispatch: RematchDispatch<RootModel>) => async ({
  projectId,
  featureStoreId,
}: {
  projectId: number;
  featureStoreId: number;
}): Promise<void> => {
  dispatch.trainingDatasetLabels.clear();

  const { data } = await new TrainingDatasetService().getList(
    projectId,
    featureStoreId,
  );

  await Promise.all(
    data.map(({ id }) => {
      return dispatch.trainingDatasetLabels.fetch({
        projectId,
        featureStoreId,
        trainingDatasetId: id,
      });
    }),
  );

  dispatch.trainingDatasets.set(data);
};
