import { useMemo } from 'react';
import { Value, Badge } from '@logicalclocks/quartz';
import { Job } from '../types/job';

const useJobRowData = (jobs: Job[]) => {
  const groupComponents = useMemo(() => {
    return jobs.map(() => [Badge, Value, Value]);
  }, [jobs]);

  const groupProps = useMemo(() => {
    return jobs.map(({ jobStatus, jobName, lastComputed }) => [
      {
        value: jobStatus,
      },
      {
        children: jobName,
      },
      {
        children: lastComputed,
      },
    ]);
  }, [jobs]);

  return useMemo(() => {
    return [groupComponents, groupProps];
  }, [groupComponents, groupProps]);
};

export default useJobRowData;
