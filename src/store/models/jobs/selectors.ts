import { RootState } from '../../index';
import { ProjectJobs } from '../../../types/jobs';

export type SelectData<Data> = {
  data: Data;
  isLoading: boolean;
};

export const selectJobsData = ({
  jobs,
  loading,
}: RootState): SelectData<ProjectJobs> => ({
  data: jobs,
  isLoading: loading.effects.jobs.fetch,
});
