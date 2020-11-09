import { FC } from 'react';

// Types
import { FeatureType } from '../../../../../types/feature-group';
import { ChartProps } from './types';
// Components
import DonutChart from './DonutChart';
import VerticalBarChart from './VerticalBarChart';
import HorizontalBarChart from './HorizontalBarChart';

export const chartsMap = new Map<FeatureType, FC<ChartProps>>([
  [FeatureType.int, VerticalBarChart],
  [FeatureType.bigInt, VerticalBarChart],
  [FeatureType.float, VerticalBarChart],
  [FeatureType.boolean, DonutChart],
  [FeatureType.string, HorizontalBarChart],
]);

const getChartNode = (type: FeatureType): FC<ChartProps> | null => {
  return chartsMap.get(type) || null;
};

export default getChartNode;
