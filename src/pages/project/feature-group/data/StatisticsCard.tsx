import { Flex } from 'rebass';
import React, { FC } from 'react';
import { Card, Subtitle, Badge } from '@logicalclocks/quartz';

// Types
import {
  Feature,
  FeatureGroupStatistics,
} from '../../../../types/feature-group';
// Components
import StatisticsTables from '../components/StatisticsTables';
import StatisticsCharts from './StatisticsCharts';
import StatisticsRows from './StatisticsRows';

export interface StatisticsCardProps {
  data: Feature;
  statistics?: FeatureGroupStatistics;
}

const StatisticsCard: FC<StatisticsCardProps> = ({ data, statistics }) => {
  const { name, type } = data;

  return (
    <Card>
      <Flex alignItems="flex-end">
        <Subtitle>{name}</Subtitle>
        <Badge ml="20px" value={data.type} variant="bold" />
      </Flex>
      {statistics && (
        <Flex alignItems="flex-start" mt="20px" flexWrap="wrap">
          <StatisticsTables data={statistics} />
          <Flex ml="auto">
            {statistics.histogram && (
              <StatisticsCharts data={statistics.histogram} type={type} />
            )}
            <StatisticsRows featureName={name} />
          </Flex>
        </Flex>
      )}
    </Card>
  );
};

export default StatisticsCard;
