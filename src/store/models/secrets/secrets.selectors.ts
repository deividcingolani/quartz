import { RootState } from '../../index';

export const selectSecrets = (state: RootState) => state.secrets;

export const selectSecretsListLoading = (state: RootState) =>
  state.loading.effects.secrets.fetchAll;

export const selectSecretLoading = (state: RootState) =>
  state.loading.effects.secrets.fetch;

export const selectSecretsCreateLoading = (state: RootState) =>
  state.loading.effects.secrets.create;
