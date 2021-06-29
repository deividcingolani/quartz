import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Types
import { Dispatch } from '../../../../store';
// Selectors
import {
  SelectData,
  selectJobsData,
} from '../../../../store/models/feature/selectors';
import { ProjectJobs } from '../../../../types/jobs';

const useJobs = (projectId: number): SelectData<ProjectJobs> => {
  const { data, isLoading } = useSelector(selectJobsData);
  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    if (data.projectId !== projectId && !isLoading) {
      dispatch.jobs.fetch({
        projectId,
      });
    }
  }, [projectId, data.jobs.length, dispatch, isLoading, data.projectId]);
  return { data, isLoading };
};

export default useJobs;
