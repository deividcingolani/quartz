import { useMemo } from 'react';
import { Value, Badge, Text } from '@logicalclocks/quartz';
import { useDispatch } from 'react-redux';
import { FeatureGroup } from '../../types/feature-group';
import { Dispatch } from '../../store';

import { remove } from '../../sources/basketSvg';
import { Feature } from '../../types/feature';

const useFeaturesListRowData = (
  features: Feature[],
  fg: FeatureGroup,
  projectId: number,
): any => {
  const dispatch = useDispatch<Dispatch>();

  const groupComponents = useMemo(() => {
    return features.map(() => [Value, Badge, Text]);
  }, [features]);

  const groupProps = useMemo(() => {
    return features.map((feature) => [
      {
        children: feature.name,
      },
      {
        value: feature.type,
      },
      {
        sx: { cursor: 'pointer' },
        mt: '1px',
        mx: '10px',
        onClick: (_e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          return dispatch.basket.deleteFeatures({
            projectId,
            featureGroup: fg,
            features: [feature],
          });
        },
        children: remove.feature,
      },
    ]);
  }, [features, dispatch, projectId, fg]);

  return useMemo(() => {
    return [groupComponents, groupProps];
  }, [groupComponents, groupProps]);
};

export default useFeaturesListRowData;
