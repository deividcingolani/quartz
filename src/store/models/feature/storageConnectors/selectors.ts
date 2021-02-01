import { RootState } from '../../../index';

export const selectFeatureStoreStorageConnectors = (state: RootState) =>
  state.featureStoreStorageConnectors;

export const selectFeatureStoreStorageConnectorsLoading = (
  state: RootState,
): boolean => state.loading.effects.featureStoreStorageConnectors.fetch;
