import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Types
import { Dispatch } from '../../../../store';
import {
  SelectData,
  selectJobsData,
} from '../../../../store/models/jobs/selectors';
// Selectors
import { ProjectJobs } from '../../../../types/jobs';
import { JobListSortType } from '../types';
import getJobListSortStr from '../utils/getJobListSortStr';

const useJobs = (
  projectId: number,
  limit = 20,
  offset = 0,
  sortBy: JobListSortType = JobListSortType.SUBMISSION_TIME,
  types: string[] = [],
  nameFilter = '',
  lastExecState = '',
): SelectData<ProjectJobs> => {
  const { data, isLoading } = useSelector(selectJobsData);
  const dispatch = useDispatch<Dispatch>();
  const sortByStr: string | null = getJobListSortStr(sortBy);

  useEffect(() => {
    if (data.projectId !== projectId && !isLoading) {
      dispatch.jobs.fetch({
        projectId,
        limit,
        offset,
        sortBy: sortByStr,
        types,
        nameFilter,
        lastExecState,
      });
    }
  }, [
    projectId,
    limit,
    offset,
    sortByStr,
    types,
    nameFilter,
    lastExecState,
    dispatch,
    isLoading,
    data.projectId,
  ]);
  return { data, isLoading };
};

export default useJobs;
