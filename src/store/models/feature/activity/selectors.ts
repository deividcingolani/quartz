import { RootState } from '../../../index';

export const selectFeatureGroupActivity = (state: RootState) =>
  state.featureGroupActivity;

export const selectFeatureGroupActivityFirstFetchLoading = (state: RootState) =>
  state.loading.effects.featureGroupActivity.fetchFirst;

export const selectFeatureGroupActivityLoading = (state: RootState) =>
  state.loading.effects.featureGroupActivity.fetch;

export const selectFeatureGroupActivityLoadingPrevious = (state: RootState) =>
  state.loading.effects.featureGroupActivity.fetchPrevious;

export const selectFeatureGroupActivityLoadingFollowing = (state: RootState) =>
  state.loading.effects.featureGroupActivity.fetchFollowing;

export const selectFeatureGroupActivityLoadingMore = (state: RootState) =>
  state.loading.effects.featureGroupActivity.fetchMore;
