import React, { FC } from 'react';

// Types
import { FeatureType, HistogramItem } from '../../../../types/feature-group';
// Utils
import getChartNode from './charts/getChartNode';

export interface StatisticsChartsProps {
  data: HistogramItem[];
  type: FeatureType;
}

const StatisticsCharts: FC<StatisticsChartsProps> = ({ data, type }) => {
  const Node = getChartNode(type);

  if (Node) {
    return <Node data={data} />;
  }

  return null;
};

export default StatisticsCharts;
