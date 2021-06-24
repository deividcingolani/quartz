import { RootState } from '../../index';

const selectProjectId = (state: RootState) => state.store.lastProject;

export default selectProjectId;
