import { createModel } from '@rematch/core';

// Services
import FeatureGroupLabelsService from '../../../services/project/FeatureGroupLabelsService';

export type FeatureGroupLabelsState = string[];

const featureGroupLabels = createModel()({
  state: [] as FeatureGroupLabelsState,
  reducers: {
    addFeatureGroupLabels: (
      _state: FeatureGroupLabelsState,
      payload: string[],
    ): FeatureGroupLabelsState => payload,
    clear: () => [],
  },
  effects: (dispatch) => ({
    fetch: async ({ projectId }: { projectId: number }): Promise<void> => {
      const data = await FeatureGroupLabelsService.getAllKeywords(projectId);

      dispatch.featureGroupLabels.addFeatureGroupLabels(data);
    },
    attachLabels: async ({
      projectId,
      featureStoreId,
      featureGroupId,
      data,
    }: {
      projectId: number;
      featureStoreId: number;
      featureGroupId: number;
      data: string[];
    }): Promise<void> => {
      await FeatureGroupLabelsService.attachKeyword(
        projectId,
        featureStoreId,
        featureGroupId,
        data,
      );
      dispatch.featureGroupView.updateLabels({ labels: data });
    },
  }),
});

export default featureGroupLabels;
