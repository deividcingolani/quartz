import { useCallback, useMemo } from 'react';

import { Value, Badge, Labeling, IconButton } from '@logicalclocks/quartz';

import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import { Feature } from '../../../../types/feature-group';

const useFeatureListRowData = (features: Feature[]) => {
  const navigate = useNavigateRelative();

  const handleNavigate = useCallback(
    (id: number, route: string) => (): void => {
      navigate(route.replace(':featureId', String(id)), 'p/:id/fg/:fgId');
    },
    [navigate],
  );

  const groupComponents = useMemo(() => {
    return features.map(({ partition, primary }) => [
      Value,
      Labeling,
      ...(partition ? [Badge] : [() => null]),
      ...(primary ? [Badge] : [() => null]),
      Badge,
      IconButton,
      IconButton,
    ]);
  }, [features]);

  const groupProps = useMemo(() => {
    return features.map(({ type, name, description, partition, primary }) => [
      {
        children: name,
      },
      {
        children: description || 'No description ',
        gray: true,
      },
      partition
        ? {
            value: 'partition key',
            width: 'max-content',
            variant: 'success',
          }
        : {},
      primary
        ? {
            value: 'primary key',
            width: 'max-content',
            variant: 'success',
          }
        : {},
      {
        value: type,
        variant: 'bold',
        marginLeft: 'auto',
        width: 'max-content',
      },
      {
        intent: 'ghost',
        icon: 'table',
        tooltip: 'Tooltip',
        onClick: handleNavigate(1, '/data/preview/:featureId'),
      },
      {
        intent: 'ghost',
        icon: 'poll',
        tooltip: 'Tooltip',
        onClick: handleNavigate(1, '/statistics/:featureId'),
      },
    ]);
  }, [features, handleNavigate]);

  return useMemo(() => {
    return [groupComponents, groupProps];
  }, [groupComponents, groupProps]);
};

export default useFeatureListRowData;
