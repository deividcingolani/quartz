import { createModel } from '@rematch/core';

// Services
import FeatureGroupLabelsService from '../../../services/project/FeatureGroupLabelsService';
// Types
import { FeatureGroupLabel } from '../../../types/feature-group';

export interface FeatureGroupLabelsState {
  [key: number]: FeatureGroupLabel[] | undefined;
}

const featureGroupLabels = createModel()({
  state: {} as FeatureGroupLabelsState,
  reducers: {
    addFeatureGroupLabels: (
      state: FeatureGroupLabelsState,
      payload: { id: number; data: FeatureGroupLabel[] | undefined },
    ): FeatureGroupLabelsState => ({ ...state, [payload.id]: payload.data }),
    clear: () => ({}),
  },
  effects: (dispatch) => ({
    fetch: async ({
      projectId,
      featureStoreId,
      featureGroupId,
    }: {
      projectId: number;
      featureStoreId: number;
      featureGroupId: number;
    }): Promise<void> => {
      const data = await FeatureGroupLabelsService.getList(
        projectId,
        featureStoreId,
        featureGroupId,
      );

      dispatch.featureGroupLabels.addFeatureGroupLabels({
        id: featureGroupId,
        data,
      });
    },
  }),
});

export default featureGroupLabels;
