import formatDistance from 'date-fns/formatDistance';
import { useMemo } from 'react';

import { Badge, Value, FreshnessBar, IconButton, IconName } from '@logicalclocks/quartz';

import { useNavigate, useParams } from 'react-router-dom';
import { Job } from '../../../../types/job';
import routeNames from '../../../../routes/routeNames';
import getHrefNoMatching from '../../../../utils/getHrefNoMatching';

const statusMap = new Map<string, 'bold' | 'fail' | 'success'>([
  ['Succeeded', 'success'],
  ['Failed', 'fail'],
  ['Running', 'bold'],
]);

const usePipelineHistoryRowData = (jobs?: Job[]) => {
  const navigate = useNavigate();
  const { id, fsId, fgId } = useParams();

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
        onClick: () => {
          // TODO Refactored, but doesn't make much sense,
          // as there is no featureId param (PipelineHistory isn't used yet tho)
          navigate(
            getHrefNoMatching(
              routeNames.featureGroup.activity,
              routeNames.project.value,
              true,
              { featureId: 1, fsId, fgId, id },
            ),
          );
        },
      },
    ]);
  }, [navigate, fgId, fsId, id, jobs]);

  return useMemo(() => {
    return [groupComponents, groupProps];
  }, [groupComponents, groupProps]);
};

export default usePipelineHistoryRowData;
