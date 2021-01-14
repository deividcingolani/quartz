import { useMemo } from 'react';
import { Feature } from '../../types/feature-group';
import { Value, Badge } from '@logicalclocks/quartz';

const useFeaturesListRowData = (features: Feature[]) => {
  const groupComponents = useMemo(() => {
    return features.map(() => [Value, Badge]);
  }, [features]);

  const groupProps = useMemo(() => {
    return features.map(({ name, type }) => [
      {
        children: name,
      },
      {
        value: type,
      },
    ]);
  }, [features]);

  return useMemo(() => {
    return [groupComponents, groupProps];
  }, [groupComponents, groupProps]);
};

export default useFeaturesListRowData;
