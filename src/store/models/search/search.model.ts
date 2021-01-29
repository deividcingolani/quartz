import { createModel } from '@rematch/core';

// Types
import { FeatureGroup } from '../../../types/feature-group';
import { TrainingDataset } from '../../../types/training-dataset';
// Services
import FeatureGroupsService from '../../../services/project/FeatureGroupsService';
import TrainingDatasetService from '../../../services/project/TrainingDatasetService';

export type SearchState = {
  featureGroups: FeatureGroup[];
  trainingDatasets: TrainingDataset[];
};

const search = createModel()({
  state: {
    featureGroups: [],
    trainingDatasets: [],
  } as SearchState,
  reducers: {
    setData: (_: SearchState, payload: SearchState): SearchState => payload,
    setFeatureGroups: (
      state: SearchState,
      payload: FeatureGroup[],
    ): SearchState => ({
      ...state,
      featureGroups: payload,
    }),
    setTrainingDatasets: (
      state: SearchState,
      payload: TrainingDataset[],
    ): SearchState => ({
      ...state,
      trainingDatasets: payload,
    }),
    clear: () => ({
      featureGroups: [],
      trainingDatasets: [],
    }),
  },
  effects: (dispatch) => ({
    fetch: async ({
      projectId,
      featureStoreId,
    }: {
      projectId: number;
      featureStoreId: number;
    }): Promise<void> => {
      const featureGroups = await FeatureGroupsService.getList(
        projectId,
        featureStoreId,
      );

      const trainingDatasets = await TrainingDatasetService.getList(
        projectId,
        featureStoreId,
      );

      dispatch.search.setData({
        featureGroups,
        trainingDatasets,
      });
    },
  }),
});

export default search;
