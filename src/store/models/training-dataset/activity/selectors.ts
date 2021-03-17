import { RootState } from '../../../index';

export const selectTrainingDatasetActivity = (state: RootState) =>
  state.trainingDatasetActivity;

export const selectTrainingDatasetActivityFirstFetchLoading = (
  state: RootState,
) => state.loading.effects.trainingDatasetActivity.fetchFirst;

export const selectTrainingDatasetActivityLoading = (state: RootState) =>
  state.loading.effects.trainingDatasetActivity.fetch;

export const selectTrainingDatasetActivityLoadingPrevious = (
  state: RootState,
) => state.loading.effects.trainingDatasetActivity.fetchPrevious;

export const selectTrainingDatasetActivityLoadingFollowing = (
  state: RootState,
) => state.loading.effects.trainingDatasetActivity.fetchFollowing;

export const selectTrainingDatasetActivityLoadingMore = (state: RootState) =>
  state.loading.effects.trainingDatasetActivity.fetchMore;
