import { FC } from 'react';

// Types
import { StatisticsFeatureType } from '../../../../../types/feature-group';
import { ChartProps } from './types';
// Components
import DonutChart from './DonutChart';
import VerticalBarChart from './VerticalBarChart';
import HorizontalBarChart from './HorizontalBarChart';

export const chartsMap = new Map<StatisticsFeatureType, FC<ChartProps>>([
  [StatisticsFeatureType.int, VerticalBarChart],
  [StatisticsFeatureType.bigInt, VerticalBarChart],
  [StatisticsFeatureType.stringUnknown, HorizontalBarChart],
  [StatisticsFeatureType.boolean, DonutChart],
  [StatisticsFeatureType.string, HorizontalBarChart],
  [StatisticsFeatureType.intFractional, VerticalBarChart],
]);

const getChartNode = (type: StatisticsFeatureType): FC<ChartProps> | null => {
  return chartsMap.get(type) || null;
};

export default getChartNode;
