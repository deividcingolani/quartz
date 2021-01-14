import { createModel } from '@rematch/core';
import FeatureStoresService from '../../../services/project/FeatureStoresService';
import { FeatureStore } from '../../../types/feature-store';

export type FeatureStoresState = FeatureStore[] | null;

const featureStores = createModel()({
  state: null as FeatureStoresState,
  reducers: {
    setFeatureStores: (
      _: FeatureStoresState,
      payload: FeatureStore[] | null,
    ): FeatureStoresState => payload,
    clear: () => [],
  },
  effects: (dispatch) => ({
    fetch: async ({ projectId }: { projectId: number }): Promise<void> => {
      dispatch.featureStores.clear();
      dispatch.featureStores.setFeatureStores(
        await FeatureStoresService.getList(projectId),
      );
    },
  }),
});

export default featureStores;
