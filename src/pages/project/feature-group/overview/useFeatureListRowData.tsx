// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { useCallback, useMemo } from 'react';

import { Value, Badge, Labeling, Tooltip, Symbol } from '@logicalclocks/quartz';

import { Box, Flex } from 'rebass';
import { useNavigate, useParams } from 'react-router-dom';
import { FeatureGroup } from '../../../../types/feature-group';
import useBasket from '../../../../hooks/useBasket';
import icons from '../../../../sources/icons';
import { Feature } from '../../../../types/feature';
import getHrefNoMatching from '../../../../utils/getHrefNoMatching';
import routeNames from '../../../../routes/routeNames';

const useFeatureListRowData = (features: Feature[], fg: FeatureGroup) => {
  const navigate = useNavigate();

  const { isActiveFeature, isSwitch, handleBasket } = useBasket();

  const { id, fsId, fgId } = useParams();

  const handleNavigate = useCallback(
    (route: string, additionalParams: any) => (): void => {
      navigate(
        getHrefNoMatching(route, routeNames.project.value, true, {
          id,
          fsId,
          fgId,
          ...additionalParams,
        }),
      );
    },
    [id, fsId, fgId, navigate],
  );

  const groupComponents = useMemo(() => {
    if (fg.onlineEnabled) {
      return features.map(({ partition, primary }) => [
        Value,
        Badge,
        Badge,
        Labeling,
        ...(partition ? [Badge] : [() => null]),
        ...(primary ? [Badge] : [() => null]),
        Tooltip,
      ]);
    }

    return features.map(({ partition, primary }) => [
      Value,
      Badge,
      Labeling,
      ...(partition ? [Badge] : [() => null]),
      ...(primary ? [Badge] : [() => null]),
      Tooltip,
    ]);
    // eslint-disable-next-line
  }, [features]);

  const groupProps = useMemo(() => {
    return features.map((feature) => {
      const { description, partition, primary, type, name, onlineType } =
        feature;

      const types = fg.onlineEnabled
        ? [
            {
              value: type,
              variant: 'label',
              marginLeft: 'auto',
              width: 'max-content',
            },
            {
              value: onlineType,
              variant: 'bold',
              marginLeft: '0',
              width: 'max-content',
            },
          ]
        : [
            {
              value: type,
              variant: 'bold',
              marginLeft: 'auto',
              width: 'max-content',
            },
          ];

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
        ...types,
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
                  onClick={handleNavigate(
                    routeNames.featureGroup.statisticsViewOne,
                    { featureName: name },
                  )}
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
                  onClick={handleNavigate(routeNames.featureGroup.previewOne, {
                    featureName: name,
                  })}
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
