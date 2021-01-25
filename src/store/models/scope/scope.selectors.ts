import { RootState } from '../../index';

export const selectScopes = (state: RootState) => state.scope;

export const selectScopesLoading = (state: RootState) =>
  state.loading.effects.scope.fetch;
