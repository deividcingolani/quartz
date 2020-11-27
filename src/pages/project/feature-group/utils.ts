import { FeatureGroup } from '../../../types/feature-group';
import labelValueMap from '../../../utils/labelValueBind';
import {
  FGItem,
  FGRow,
} from '@logicalclocks/quartz/dist/components/table/type';

// Filter
export const filterFG = (
  data: FeatureGroup[],
  filter: string[],
): FeatureGroup[] => {
  if (filter.length) {
    return data.filter(({ labels }) => filter.some((f) => labels?.includes(f)));
  }
  return data;
};

// Sort
export type FGSortFunction = (fg1: FeatureGroup, fg2: FeatureGroup) => number;

interface SortParams {
  [key: string]: FGSortFunction;
}

export const sortOptions: SortParams = {
  'creation date': ({ created: c1 }, { created: c2 }) => {
    const time1 = new Date(c1).getTime();
    const time2 = new Date(c2).getTime();

    if (time1 === time2) {
      return 0;
    }

    return time1 < time2 ? 1 : -1;
  },
  name: ({ name: n1 }, { name: n2 }) => n1.localeCompare(n2),
};

export const sortFG = (data: FeatureGroup[], sort: string): FeatureGroup[] => {
  const sortFunction = sortOptions[sort];

  return sortFunction ? data.sort(sortFunction) : data;
};

export const searchFGText = (
  data: FeatureGroup[],
  text: string,
): FeatureGroup[] =>
  !text
    ? data
    : data.filter(({ name, id }) =>
        JSON.stringify({ name, id }).toLowerCase().includes(text.toLowerCase()),
      );

export const featuresMap = labelValueMap<{ [key: string]: string }>({
  'Primary key': 'primary',
  'Partition key': 'partition',
  'Online type': 'onlineType',
  'Offline type': 'type',
  Name: 'name',
  Description: 'description',
  Statistics: 'statistics',
  'Default Value': 'defaultValue',
});

const getColumnValue = (key: string, value: any) => {
  if (key === 'type' || key === 'onlineType') {
    return [value.toUpperCase()];
  }
  if (value === null) {
    return '';
  }

  return value;
};

export const isUpdated = <T extends FGRow[]>(prev: T) => (next: T) => {
  const nextItems = next.filter(({ row }: FGRow) =>
    row.find(({ readOnly }) => readOnly),
  );
  return JSON.stringify(prev) !== JSON.stringify(nextItems);
};

export const mapFeatures = (features: FGRow[]) =>
  features.map(({ row }) =>
    row
      .filter(({ columnName }) => columnName !== 'Statistics')
      .map(({ columnValue, columnName }) => ({
        [featuresMap.getByKey(columnName)]: Array.isArray(columnValue)
          ? columnValue[0]
          : columnValue,
      }))
      .reduce(
        (acc, arr) => ({
          ...acc,
          ...arr,
        }),
        {},
      ),
  );

export const getColumnValueByName = (
  row: FGItem[],
  name: string,
): FGItem['columnValue'] | undefined =>
  row.find(({ columnName }) => columnName === name)?.columnValue;

export const getEnabledStatistics = (features: FGRow[]) =>
  features.reduce(
    (statistics: string[], { row }) =>
      getColumnValueByName(row, 'Statistics')
        ? [...statistics, getColumnValueByName(row, 'Name') as string]
        : statistics,
    [],
  );

export const mapStatisticConfiguration = (statistics: string[]) => ({
  descStatsEnabled: statistics.includes('descriptive statistics'),
  featCorrEnabled: statistics.includes('histograms'),
  featHistEnabled: statistics.includes('correlations'),
});

export const mapStatisticConfigurationToTable = ({
  descStatsEnabled,
  featCorrEnabled,
  featHistEnabled,
}: FeatureGroup) => {
  const statistics = [];
  if (descStatsEnabled) {
    statistics.push('descriptive statistics');
  }
  if (featCorrEnabled) {
    statistics.push('histograms');
  }
  if (featHistEnabled) {
    statistics.push('correlations');
  }
  return statistics;
};

export const mapFeaturesToTable = (featureGroup?: FeatureGroup): FGRow[] => {
  if (featureGroup) {
    const { features, statisticColumns } = featureGroup;
    return features.map((feature) => {
      const base: any[] = [];
      if (
        (statisticColumns.includes(feature.name) || !statisticColumns.length) &&
        featureGroup.descStatsEnabled
      ) {
        base.push({
          columnName: 'Statistics',
          columnValue: true,
        });
      } else {
        base.push({
          columnName: 'Statistics',
          columnValue: false,
        });
      }
      if (!feature.description) {
        base.push({
          columnName: 'Description',
          columnValue: '',
        });
      }
      if (!feature.onlineType) {
        base.push({
          columnName: 'Online type',
          columnValue: [],
        });
      }
      return {
        row: [
          ...base,
          ...Object.keys(feature).map((key) => ({
            columnName: featuresMap.getByValue(key),
            // @ts-ignore
            columnValue: getColumnValue(key, feature[key]),
            readOnly: true,
          })),
        ],
      };
    }) as FGRow[];
  }
  return [];
};
