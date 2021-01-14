import React, { useCallback, useMemo } from 'react';

import {
  Value,
  Badge,
  Labeling,
  IconButton,
  Tooltip,
  Symbol,
} from '@logicalclocks/quartz';

import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import { Feature, FeatureGroup } from '../../../../types/feature-group';
import useBasket from '../../../../hooks/useBasket';
import { Box, Flex } from 'rebass';

const useFeatureListRowData = (features: Feature[], fg: FeatureGroup) => {
  const navigate = useNavigateRelative();

  const { isActiveFeature, isSwitch, handleBasket } = useBasket();

  const handleNavigate = useCallback(
    (route: string) => (): void => {
      navigate(route, 'p/:id/fg/:fgId');
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
      Tooltip,
    ]);
  }, [features]);

  const groupProps = useMemo(() => {
    return features.map((feature) => {
      const { description, partition, primary, type, name } = feature;

      return [
        {
          children: isSwitch ? (
            <Flex>
              {name}
              <Box ml="5px">
                <Symbol
                  handleClick={handleBasket([feature], fg)}
                  inBasket={isActiveFeature(feature, fg)}
                  tooltipMainText={
                    isActiveFeature(feature, fg)
                      ? 'Remove this feature from basket'
                      : 'Add this feature to basket'
                  }
                />
              </Box>
            </Flex>
          ) : (
            name
          ),
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
          disabled: true,
          children: React.createElement(
            Flex,
            {},
            React.createElement(IconButton, {
              intent: 'ghost',
              icon: 'table',
              tooltip: 'Data preview',
              onClick: handleNavigate(`/data-preview/${name}`),
            }),
            React.createElement(IconButton, {
              intent: 'ghost',
              icon: 'poll',
              tooltip: 'Statistics',
              onClick: handleNavigate(`/statistics/f/${name}`),
            }),
          ),
        },
      ];
    });
  }, [features, handleNavigate, isActiveFeature, handleBasket, fg, isSwitch]);

  return useMemo(() => {
    return [groupComponents, groupProps];
  }, [groupComponents, groupProps]);
};

export default useFeatureListRowData;
