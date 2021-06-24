// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC } from 'react';
import { Box, Flex } from 'rebass';
import {
  Badge,
  Card,
  Labeling,
  Subtitle,
  Symbol,
  Value,
} from '@logicalclocks/quartz';

// Types
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
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
import { selectFeatureStoreData } from '../../../../store/models/feature/selectors';
import { Feature } from '../../../../types/feature';

export interface StatisticsCardProps {
  data: Feature;
  statistics: FeatureGroupStatistics;
  type: ItemDrawerTypes;
  parent: FeatureGroup | TrainingDataset;
}

const StatisticsCard: FC<StatisticsCardProps> = ({
  data,
  parent,
  statistics,
  type: dataType,
}) => {
  const { name } = data;

  const { id, fgId } = useParams();

  const { data: featureStoreData } = useSelector(selectFeatureStoreData);

  const { isActiveFeature, handleBasket, isSwitch } = useBasket();

  return (
    <Card>
      {dataType === ItemDrawerTypes.fg && (
        <Flex alignItems="flex-end">
          <Subtitle>{name}</Subtitle>
          {isSwitch && dataType === ItemDrawerTypes.fg && (
            <Box ml="10px">
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
          <Badge ml="20px" value={statistics.dataType} variant="bold" />
        </Flex>
      )}

      {dataType === ItemDrawerTypes.td && (
        <Flex alignItems="flex-end">
          <Flex flexDirection="column">
            <Flex>
              <Subtitle>{name}</Subtitle>
              <Badge ml="20px" value={statistics.dataType} variant="bold" />
            </Flex>
            <Flex mt="5px">
              {data.basefeaturegroup ? (
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
        <Flex
          justifyContent="space-between"
          alignItems="flex-start"
          mt="20px"
          flexWrap="wrap"
        >
          <StatisticsTables data={statistics} />
          {statistics.histogram ? (
            <Box width="calc((100% - 60px) / 4)">
              <StatisticsCharts
                dataType={dataType}
                data={statistics.histogram}
                type={statistics.dataType}
              />
            </Box>
          ) : (
            <Box width="calc((100% - 60px) / 4)" />
          )}
          {dataType === ItemDrawerTypes.fg &&
          featureStoreData?.featurestoreId ? (
            <StatisticsRows
              projectId={+id}
              fgId={+fgId}
              featureStoreId={featureStoreData.featurestoreId}
              featureName={name}
            />
          ) : (
            <Box width="calc((100% - 60px) / 4)" />
          )}
        </Flex>
      )}
    </Card>
  );
};

export default StatisticsCard;
