import { RootState } from '../../index';

export const selectProjectId = (state: RootState) => state.store.lastProject;
