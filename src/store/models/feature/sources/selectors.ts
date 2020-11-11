import { RootState } from '../../../index';

export const selectFeatureStoreSources = (state: RootState) =>
  state.featureStoreSources;

export const selectFeatureStoreSourcesLoading = (state: RootState): boolean =>
  state.loading.effects.featureStoreSources.fetch;
