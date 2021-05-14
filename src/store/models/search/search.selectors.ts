import { RootState } from '../../index';

export const selectSearchState = (state: RootState) => state.search;

export const selectDeepSearchState = (state: RootState) => state.deepSearch;

export const selectDeepSearchFeaturesState = (state: RootState) =>
  state.deepSearch.features;

export const selectDeepSearchFeatureGroupsState = (state: RootState) =>
  state.deepSearch.featureGroups;

export const selectDeepSearchTrainingDatasetsState = (state: RootState) =>
  state.deepSearch.trainingDatasets;

export const selectDeepSearchCountState = (state: RootState) =>
  state.deepSearch.searchCount;

export const selectDeepSearchLoading = (state: RootState) => {
  const loadingEffects = state.loading.effects.deepSearch;

  return Object.values(loadingEffects).some(Boolean);
};
