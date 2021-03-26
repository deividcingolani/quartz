import { RootState } from '../../index';

export const selectValidators = (state: RootState) => state.validators;

export const selectValidatorsLoading = (state: RootState) =>
  state.loading.effects.validators.fetch;
