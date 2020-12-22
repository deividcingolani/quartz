import { useCallback, useMemo } from 'react';
import { Value, Labeling, Badge, IconButton } from '@logicalclocks/quartz';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import TdFeatureGroupHandle from './TdFeatureGroupHandle';
import { Feature } from '../../../../types/feature-group';

const useTdFeatureListRowData = (features: Feature[]) => {
  const navigate = useNavigateRelative();

  const handleNavigate = useCallback(
    (id: number, route: string) => (): void => {
      // Is this route correct
      navigate(route.replace(':featureId', String(id)), 'p/:id/td/:tdId');
    },
    [navigate],
  );

  const groupComponents = useMemo(() => {
    return features.map(({ label }) => [
      Value,
      TdFeatureGroupHandle,
      Labeling,
      ...(label ? [Badge] : [() => null]),
      Badge,
      IconButton,
    ]);
  }, [features]);

  const groupProps = useMemo(() => {
    return features.map(({ name, featuregroup, description, type, label }) => [
      {
        children: name,
      },
      {
        featureGroup: featuregroup,
      },
      {
        children: description || 'No description ',
        gray: true,
      },
      label
        ? {
            value: 'target feature',
            width: 'max-content',
            variant: 'success',
          }
        : {},
      {
        value: type,
        variant: 'bold',
        width: 'max-content',
      },
      {
        intent: 'ghost',
        icon: 'poll',
        tooltip: 'Statistics',
        onClick: handleNavigate(1, `/statistics/f/${name}`),
      },
    ]);
  }, [features, handleNavigate]);

  return useMemo(() => {
    return [groupComponents, groupProps];
  }, [groupComponents, groupProps]);
};

export default useTdFeatureListRowData;
