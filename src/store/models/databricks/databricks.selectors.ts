import { RootState } from '../../index';

export const selectDatabricks = (state: RootState) => state.databricks;

export const selectDatabricksLoading = (state: RootState) =>
  state.loading.effects.databricks.fetch;
