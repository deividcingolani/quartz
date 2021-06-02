import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Types
import { Dispatch } from '../../../../store';
// Selectors
import {
  SelectData,
  selectJobsData,
} from '../../../../store/models/feature/selectors';
import { Jobs } from '../../../../types/jobs';

const useJobs = (projectId: number): SelectData<Jobs[]> => {
  const { data, isLoading } = useSelector(selectJobsData);
  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    if (!data.length && !isLoading) {
      dispatch.jobs.fetch({
        projectId,
      });
    }
  }, [projectId, data.length, dispatch, isLoading]);
  return { data, isLoading };
};

export default useJobs;
