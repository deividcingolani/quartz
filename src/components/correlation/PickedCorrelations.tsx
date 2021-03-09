import { memo } from 'react';
import { Box, Flex } from 'rebass';
import React, { FC, useMemo } from 'react';
import {
  Card,
  Button,
  Label,
  Labeling,
  Symbol,
  SymbolMode,
} from '@logicalclocks/quartz';

import Cell from './components/Cell';
import { CorrelationValue } from './types';
import { ItemDrawerTypes } from '../drawer/ItemDrawer';
import { DataEntity } from '../../types';
import useBasket from '../../hooks/useBasket';
import { Feature, FeatureGroup } from '../../types/feature-group';

export interface PickedCorrelationsProps {
  pickedCorrelations: CorrelationValue[];
  onClearPicked: () => void;
  type: ItemDrawerTypes;
  item: DataEntity;
}

const PickedCorrelations: FC<PickedCorrelationsProps> = ({
  pickedCorrelations,
  onClearPicked,
  type,
  item,
}) => {
  const featuresOccurrences = useMemo(() => {
    return pickedCorrelations.reduce(
      (acc: { [key: string]: number }, picked) => {
        if (!acc[picked.horizontal]) {
          acc[picked.horizontal] = 0;
        }
        if (!acc[picked.vertical]) {
          acc[picked.vertical] = 0;
        }

        acc[picked.vertical]++;
        acc[picked.horizontal]++;

        return acc;
      },
      {},
    );
  }, [pickedCorrelations]);

  const {
    isActiveFeature,
    handleBasket,
    isSwitch,
    isActiveFeatures,
  } = useBasket();

  const pickedFeatures = useMemo(() => {
    return Object.keys(featuresOccurrences).reduce((acc: Feature[], name) => {
      const feature = item.features.find((feature) => feature.name === name);

      return !!feature ? [...acc, feature] : acc;
    }, []);
  }, [item, featuresOccurrences]);

  if (!pickedCorrelations.length) {
    return (
      <Card mb="40px" mt="20px" title="Hand picked correlations">
        <Box mt="20px" mx="-20px">
          <Flex height="50px" mt="30px" justifyContent="center">
            <Labeling textAlign="center" fontSize="18px" gray>
              To hand pick a correlation, click on a square of the matrix or
              select it from the list view
            </Labeling>
          </Flex>
        </Box>
      </Card>
    );
  }

  return (
    <Card
      my="20px"
      maxHeight="440px"
      title="Hand picked correlations"
      actions={
        <Button mr="-20px" intent="inline" onClick={onClearPicked}>
          clear history
        </Button>
      }
    >
      <Flex flexDirection="column" my="-20px">
        <Flex
          px="15px"
          py="15px"
          mx="-20px"
          flexWrap="wrap"
          sx={{ rowGap: '8px' }}
        >
          {Object.entries(featuresOccurrences)
            .sort(([_, timesA], [__, timesB]) => -Math.sign(timesA - timesB))
            .map(([featureName, times], index) => {
              const hasNext =
                index !== Object.keys(featuresOccurrences).length - 1;
              const isFirst = !index;

              return (
                <Flex key={featureName}>
                  <Label>{featureName}</Label>
                  <Labeling ml="5px" gray>
                    {isFirst
                      ? `(${times} ${times > 1 ? 'occurrences' : 'occurrence'})`
                      : `(${times})`}
                  </Labeling>
                  {hasNext && <Label mr="2px">,</Label>}
                </Flex>
              );
            })}

          {isSwitch && type === ItemDrawerTypes.fg && (
            <Box ml="10px" mt="-2px">
              <Symbol
                handleClick={handleBasket(pickedFeatures, item as FeatureGroup)}
                mode={SymbolMode.bulk}
                tooltipMainText={
                  isActiveFeatures(pickedFeatures, item as FeatureGroup)
                    ? 'Remove all features from basket'
                    : 'Add all features to basket'
                }
                tooltipSecondaryText={`${pickedFeatures.length} features`}
                inBasket={isActiveFeatures(
                  pickedFeatures,
                  item as FeatureGroup,
                )}
              />
            </Box>
          )}
        </Flex>
        <Flex mx="-20px" flexDirection="column">
          {pickedCorrelations.map(({ vertical, value, horizontal }) => {
            const verticalFeature = item.features.find(
              ({ name }) => name === vertical,
            );
            const horizontalFeature = item.features.find(
              ({ name }) => name === horizontal,
            );

            if (!verticalFeature || !horizontalFeature) {
              return null;
            }

            return (
              <Flex
                px="15px"
                py="10px"
                alignItems="center"
                justifyContent="space-between"
                key={`picked-${vertical}-${horizontal}-${value}`}
                sx={{ boxShadow: '0px -1px 0px rgba(0, 0, 0, 0.25)' }}
              >
                <Flex alignItems="center">
                  <Flex
                    width="100px"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Cell value={value} />
                    <Label>{value.toFixed(4)}</Label>
                  </Flex>

                  <Label ml="50px">{vertical}</Label>

                  {isSwitch && type === ItemDrawerTypes.fg && (
                    <Box mb="2px" ml="10px">
                      <Symbol
                        handleClick={handleBasket(
                          [verticalFeature],
                          item as FeatureGroup,
                        )}
                        inBasket={isActiveFeature(
                          verticalFeature,
                          item as FeatureGroup,
                        )}
                        tooltipMainText={
                          isActiveFeature(verticalFeature, item as FeatureGroup)
                            ? 'Remove this feature from basket'
                            : 'Add this feature to basket'
                        }
                      />
                    </Box>
                  )}
                </Flex>

                <Flex>
                  <Label>{horizontal}</Label>

                  {isSwitch && type === ItemDrawerTypes.fg && (
                    <Box mb="2px" ml="10px">
                      <Symbol
                        handleClick={handleBasket(
                          [horizontalFeature],
                          item as FeatureGroup,
                        )}
                        inBasket={isActiveFeature(
                          horizontalFeature,
                          item as FeatureGroup,
                        )}
                        tooltipMainText={
                          isActiveFeature(
                            horizontalFeature,
                            item as FeatureGroup,
                          )
                            ? 'Remove this feature from basket'
                            : 'Add this feature to basket'
                        }
                      />
                    </Box>
                  )}
                </Flex>
              </Flex>
            );
          })}
        </Flex>
      </Flex>
    </Card>
  );
};

export default memo(PickedCorrelations);
