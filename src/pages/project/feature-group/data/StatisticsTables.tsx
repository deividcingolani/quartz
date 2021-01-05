import React, { FC, useMemo } from 'react';

// Types
import StatsTable, {
  StatsTableItem,
} from '../../../../components/stats-table/StatsTable';
import { FeatureGroupStatistics } from '../../../../types/feature-group';
import { Flex } from 'rebass';

export interface StatisticsTablesProps {
  data: FeatureGroupStatistics;
  isDrawer?: boolean;
}

type ColumnDef = [keyof FeatureGroupStatistics, string];

const pickData = (
  data: FeatureGroupStatistics,
  columns: ColumnDef[],
): StatsTableItem[] | null => {
  const result = columns.reduce(
    (acc, [key, title]) => [
      ...acc,
      { title, value: data[key] } as StatsTableItem,
    ],
    [] as StatsTableItem[],
  );

  if (result.every(({ value }) => !value)) {
    return null;
  }

  return result;
};

const StatisticsTables: FC<StatisticsTablesProps> = ({ data, isDrawer }) => {
  const summaryData: StatsTableItem[] | null = useMemo(() => {
    return pickData(data || {}, [
      ['minimum', 'min'],
      ['maximum', 'max'],
      ['mean', 'mean'],
      ['sum', 'sum'],
      ['stdDev', 'std dev'],
    ]);
  }, [data]);

  const detailsData: StatsTableItem[] | null = useMemo(() => {
    return pickData(data || {}, [
      ['approximateNumDistinctValues', 'distinct count'],
      ['completeness', 'completeness'],
      ['uniqueness', 'uniqueness'],
      ['distinctness', 'distinctness'],
      ['entropy', 'entropy'],
    ]);
  }, [data]);

  if (isDrawer) {
    return (
      <Flex width="100%" flexDirection="column">
        {summaryData && <StatsTable data={summaryData} />}
        {detailsData && <StatsTable data={detailsData} />}
      </Flex>
    );
  }

  return (
    <>
      {summaryData && <StatsTable data={summaryData} width="250px" />}
      {detailsData && <StatsTable data={detailsData} width="250px" ml="20px" />}
    </>
  );
};

export default StatisticsTables;
