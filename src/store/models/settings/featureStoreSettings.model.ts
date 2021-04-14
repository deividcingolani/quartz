import { createModel } from '@rematch/core';
import { FeatureStoreSettings } from '../../../types/feature-store';
import FeatureStoresService from '../../../services/project/FeatureStoresService';

export type FeatureStoreSettingsState = FeatureStoreSettings | null;

const featureStoreSettings = createModel()({
  state: null as FeatureStoreSettingsState,
  reducers: {
    set: (
      _: FeatureStoreSettingsState,
      payload: FeatureStoreSettingsState,
    ): FeatureStoreSettingsState => payload,
    clear: () => null,
  },
  effects: (dispatch) => ({
    fetch: async ({ projectId }: { projectId: number }): Promise<void> => {
      const { data } = await FeatureStoresService.settings(projectId);
      dispatch.featureStoreSettings.set(data);
    },
  }),
});

export default featureStoreSettings;
