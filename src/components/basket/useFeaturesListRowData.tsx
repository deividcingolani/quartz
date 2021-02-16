import React, { useMemo } from 'react';
import { Feature, FeatureGroup } from '../../types/feature-group';
import { Value, Badge, Button } from '@logicalclocks/quartz';
import { useDispatch } from 'react-redux';
import { Dispatch } from '../../store';

const useFeaturesListRowData = (
  features: Feature[],
  fg: FeatureGroup,
  projectId: number,
) => {
  const dispatch = useDispatch<Dispatch>();

  const groupComponents = useMemo(() => {
    return features.map(() => [Value, Badge, Button]);
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
        intent: 'ghost',
        onClick: () =>
          dispatch.basket.deleteFeatures({
            projectId,
            featureGroup: fg,
            features: [feature],
          }),
        children: (
          <svg
            width="10"
            height="9"
            viewBox="0 0 10 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.63155 0.437C1.40375 0.216313 1.0344 0.216313 0.806597 0.437C0.578791 0.657687 0.578791 1.01549 0.806597 1.23618L4.17519 4.4995L0.806631 7.7628C0.578826 7.98348 0.578826 8.34129 0.806631 8.56198C1.03444 8.78266 1.40378 8.78266 1.63159 8.56198L5.00015 5.29868L8.36871 8.56198C8.59652 8.78266 8.96586 8.78266 9.19367 8.56198C9.42148 8.34129 9.42148 7.98348 9.19367 7.7628L5.82511 4.4995L9.1937 1.23618C9.42151 1.01549 9.42151 0.657687 9.1937 0.437C8.9659 0.216313 8.59655 0.216313 8.36875 0.437L5.00015 3.70033L1.63155 0.437Z"
              fill="black"
            />
          </svg>
        ),
      },
    ]);
  }, [features, dispatch, projectId, fg]);

  return useMemo(() => {
    return [groupComponents, groupProps];
  }, [groupComponents, groupProps]);
};

export default useFeaturesListRowData;
