import { JobListSortType } from '../types';

export default (sortBy: JobListSortType): string | null => {
  if (sortBy === JobListSortType.SUBMISSION_TIME) {
    return 'submissiontime:desc';
  }
  if (sortBy === JobListSortType.CREATION_TIME) {
    return 'date_created:desc';
  }

  return null;
};
