import { useMemo } from 'react';
import { Value, Badge, Labeling } from '@logicalclocks/quartz';
import { FeatureGroup } from '../../../../../types/feature-group';

const useExpectationFeatureListData = (
  features: string[],
  featureGroup: FeatureGroup,
) => {
  const groupComponents = useMemo(() => {
    return features.map(() => [Value, Badge, Labeling, Badge]);
  }, [features]);

  const groupProps = useMemo(() => {
    return features.map((name) => {
      const isExistInFg = featureGroup.features
        .map(({ name }) => name)
        .includes(name);

      const featureInFg = featureGroup.features.find(
        (feature) => feature.name === name,
      );

      return [
        {
          children: name,
        },
        {
          width: 'fit-content',
          value: isExistInFg ? 'present' : 'absent',
          variant: isExistInFg ? 'success' : 'light',
        },
        {
          children: featureGroup.name,
        },
        {
          value: featureInFg?.type || '-',
        },
      ];
    });
  }, [features, featureGroup]);

  return useMemo(() => {
    return [groupComponents, groupProps];
  }, [groupComponents, groupProps]);
};

export default useExpectationFeatureListData;
