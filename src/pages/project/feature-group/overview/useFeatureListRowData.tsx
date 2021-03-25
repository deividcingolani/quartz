import React, { useCallback, useMemo } from 'react';

import { Value, Badge, Labeling, Tooltip, Symbol } from '@logicalclocks/quartz';

import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import { Feature, FeatureGroup } from '../../../../types/feature-group';
import useBasket from '../../../../hooks/useBasket';
import { Box, Flex } from 'rebass';
import icons from '../../../../sources/icons';

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
      Badge,
      Labeling,
      ...(partition ? [Badge] : [() => null]),
      ...(primary ? [Badge] : [() => null]),
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
              <Box mr="15px">
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
              {name}
            </Flex>
          ) : (
            name
          ),
        },
        {
          value: type,
          variant: 'bold',
          marginLeft: 'auto',
          width: 'max-content',
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
          disabled: true,
          children: (
            <Flex>
              <Tooltip mainText="Statistics">
                <Box
                  p="5px"
                  height="28px"
                  sx={{
                    cursor: 'pointer',
                    backgroundColor: '#ffffff',
                    transition: 'all .4s ease',

                    ':hover': {
                      backgroundColor: 'grayShade3',
                    },

                    svg: {
                      width: '20px',
                      height: '20px',
                    },
                  }}
                  onClick={handleNavigate(`/statistics/f/${name}`)}
                >
                  {icons.stats}
                </Box>
              </Tooltip>
              <Tooltip ml="8px" mainText="Data preview">
                <Box
                  p="5px"
                  height="28px"
                  sx={{
                    cursor: 'pointer',
                    backgroundColor: '#ffffff',
                    transition: 'all .4s ease',

                    ':hover': {
                      backgroundColor: 'grayShade3',
                    },

                    svg: {
                      width: '20px',
                      height: '20px',
                    },
                  }}
                  onClick={handleNavigate(`/data-preview/${name}`)}
                >
                  {icons.table}
                </Box>
              </Tooltip>
            </Flex>
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
