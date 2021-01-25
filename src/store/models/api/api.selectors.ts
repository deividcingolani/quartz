import { RootState } from '../../index';

export const selectApiKeys = (state: RootState) => state.api;

export const selectApiKeysLoading = (state: RootState) =>
  state.loading.effects.api.fetch;

export const selectApiKeysCreateLoading = (state: RootState) =>
  state.loading.effects.api.create;

export const selectApiKeysEditLoading = (state: RootState) =>
  state.loading.effects.api.edit;
