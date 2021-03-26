import { RootState } from '../../index';

export const selectExpectations = (state: RootState) => state.expectations;

export const selectExpectationsLoading = (state: RootState) =>
  state.loading.effects.expectations.fetch;

export const selectExpectationAttachLoading = (state: RootState) =>
  state.loading.effects.expectations.attach;

export const selectExpectationDetachLoading = (state: RootState) =>
  state.loading.effects.expectations.detach;

export const selectExpectationCreateLoading = (state: RootState) =>
  state.loading.effects.expectations.create;

export const selectExpectationEditLoading = (state: RootState) =>
  state.loading.effects.expectations.edit;

export const selectExpectationViewLoading = (state: RootState) =>
  state.loading.effects.expectationView.fetch;

export const selectExpectationView = (state: RootState) =>
  state.expectationView;
