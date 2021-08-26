import formatDistance from 'date-fns/formatDistance';
import { useCallback, useMemo } from 'react';

import { Badge, Value, FreshnessBar, IconButton, IconName } from '@logicalclocks/quartz';

import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import { Job } from '../../../../types/job';

const statusMap = new Map<string, 'bold' | 'fail' | 'success'>([
  ['Succeeded', 'success'],
  ['Failed', 'fail'],
  ['Running', 'bold'],
]);

const usePipelineHistoryRowData = (jobs?: Job[]) => {
  const navigate = useNavigateRelative();

  const handleNavigate = useCallback(
    (id: number, route: string) => (): void => {
      navigate(
        route.replace(':featureId', String(id)),
        'p/:id/fs/:fsId/fg/:fgId',
      );
    },
    [navigate],
  );

  const groupComponents = useMemo(() => {
    return jobs?.map(() => [
      Badge,
      Badge,
      Value,
      FreshnessBar,
      Value,
      IconButton,
    ]);
  }, [jobs]);

  const groupProps = useMemo(() => {
    return jobs?.map(({ jobName, lastComputed, jobStatus }) => [
      {
        value: jobStatus,
        variant: statusMap.get(jobStatus),
      },
      {
        value: 'Spark',
        width: 'max-content',
        variant: 'bold',
      },
      {
        children: jobName,
      },
      {
        time: lastComputed.replace('T', ' '),
      },
      {
        children: `${formatDistance(new Date(lastComputed), new Date())} ago`,
      },
      {
        intent: 'ghost',
        icon: IconName.more_zoom,
        tooltip: 'Activity',
        onClick: handleNavigate(1, '/activity'),
      },
    ]);
  }, [jobs, handleNavigate]);

  return useMemo(() => {
    return [groupComponents, groupProps];
  }, [groupComponents, groupProps]);
};

export default usePipelineHistoryRowData;
