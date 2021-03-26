import { RootState } from '../../index';

export const selectRules = (state: RootState) => state.rules;

export const selectRulesLoading = (state: RootState) =>
  state.loading.effects.rules.fetch;
