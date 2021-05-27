import { useMemo } from 'react';
import { Feature, FeatureGroup } from '../../types/feature-group';
import { Value, Badge, Text } from '@logicalclocks/quartz';
import { useDispatch } from 'react-redux';
import { Dispatch } from '../../store';

import { remove } from '../../sources/basketSvg';

const useFeaturesListRowData = (
  features: Feature[],
  fg: FeatureGroup,
  projectId: number,
) => {
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
        onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>{ 
          return dispatch.basket.deleteFeatures({
            projectId,
            featureGroup: fg,
            features: [feature],
          })
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
