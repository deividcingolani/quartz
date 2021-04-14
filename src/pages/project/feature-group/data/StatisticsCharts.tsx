import React, { FC } from 'react';

// Types
import {
  HistogramItem,
  StatisticsFeatureType,
} from '../../../../types/feature-group';
// Utils
import getChartNode from './charts/getChartNode';
import { ItemDrawerTypes } from '../../../../components/drawer/ItemDrawer';

export interface StatisticsChartsProps {
  data: HistogramItem[];
  type: StatisticsFeatureType;
  dataType: ItemDrawerTypes;
}

const StatisticsCharts: FC<StatisticsChartsProps> = ({
  data,
  type,
  dataType,
}) => {
  const Node = getChartNode(type);
  if (Node) {
    return <Node dataType={dataType} data={data} />;
  }

  return null;
};

export default StatisticsCharts;
