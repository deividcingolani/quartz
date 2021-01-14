import { Box, Flex } from 'rebass';
import React, { FC } from 'react';
import {
  Badge,
  Card,
  Labeling,
  Subtitle,
  Symbol,
  Value,
} from '@logicalclocks/quartz';

// Types
import {
  Feature,
  FeatureGroup,
  FeatureGroupStatistics,
} from '../../../../types/feature-group';
// Components
import StatisticsCharts from './StatisticsCharts';
import StatisticsRows from './StatisticsRows';
import StatisticsTables from './StatisticsTables';
import { ItemDrawerTypes } from '../../../../components/drawer/ItemDrawer';
import { TrainingDataset } from '../../../../types/training-dataset';
import useBasket from '../../../../hooks/useBasket';

export interface StatisticsCardProps {
  data: Feature;
  statistics?: FeatureGroupStatistics;
  type: ItemDrawerTypes;
  parent: FeatureGroup | TrainingDataset;
}

const StatisticsCard: FC<StatisticsCardProps> = ({
  data,
  parent,
  statistics,
  type: dataType,
}) => {
  const { name, type } = data;

  const { isActiveFeature, handleBasket, isSwitch } = useBasket();

  return (
    <Card>
      {dataType === ItemDrawerTypes.fg && (
        <Flex alignItems="flex-end">
          <Subtitle>{name}</Subtitle>
          {isSwitch && dataType === ItemDrawerTypes.fg && (
            <Box mb="2px" ml="10px">
              <Symbol
                handleClick={handleBasket([data], parent as FeatureGroup)}
                inBasket={isActiveFeature(data, parent as FeatureGroup)}
                tooltipMainText={
                  isActiveFeature(data, parent as FeatureGroup)
                    ? 'Remove this feature from basket'
                    : 'Add this feature to basket'
                }
              />
            </Box>
          )}
          <Badge ml="20px" value={data.type} variant="bold" />
        </Flex>
      )}

      {dataType === ItemDrawerTypes.td && (
        <Flex alignItems="flex-end">
          <Flex flexDirection="column">
            <Flex>
              <Subtitle>{name}</Subtitle>
              <Badge ml="20px" value={data.type} variant="bold" />
            </Flex>
            <Flex mt="5px">
              {!!data.basefeaturegroup ? (
                <>
                  <Labeling gray>from</Labeling>
                  <Value ml="5px">{data?.basefeaturegroup?.name}</Value>
                  <Value ml="5px" sx={{ color: 'labels.orange' }}>
                    #{data?.basefeaturegroup?.id}
                  </Value>
                  <Value ml="5px">(v{data?.basefeaturegroup?.version})</Value>
                </>
              ) : (
                <Labeling bold gray>
                  unavailable origin feature group
                </Labeling>
              )}
            </Flex>
          </Flex>
        </Flex>
      )}

      {statistics && (
        <Flex alignItems="flex-start" mt="20px" flexWrap="wrap">
          <StatisticsTables data={statistics} />
          <Flex
            sx={
              dataType === ItemDrawerTypes.td
                ? { flexGrow: 1, justifyContent: 'center' }
                : {}
            }
          >
            {statistics.histogram && (
              <StatisticsCharts
                dataType={dataType}
                data={statistics.histogram}
                type={type}
              />
            )}
            {dataType === ItemDrawerTypes.fg && (
              <StatisticsRows featureName={name} />
            )}
          </Flex>
        </Flex>
      )}
    </Card>
  );
};

export default StatisticsCard;
