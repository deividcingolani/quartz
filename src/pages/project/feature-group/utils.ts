import {
  FGItem,
  FGRow,
} from '@logicalclocks/quartz/dist/components/table/type';
import { format, isToday } from 'date-fns';
import {
  ActivityItem,
  FeatureGroup,
  SchematisedTagEntity,
} from '../../../types/feature-group';
import labelValueMap from '../../../utils/labelValueBind';
import {
  anyType,
  float,
  floatRequired,
  integer,
  integerRequired,
  string,
  stringRequired,
} from '../../../utils/validators';
import { uppercaseFirst } from '../../../utils/uppercaseFirst';
import { DataEntity } from '../../../types';

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
  'last updated': ({ updated: c1 }, { updated: c2 }) => {
    const time1 = new Date(c1).getTime();
    const time2 = new Date(c2).getTime();

    if (time1 === time2) {
      return 0;
    }

    return time1 < time2 ? 1 : -1;
  },
  'last created': ({ created: c1 }, { created: c2 }) => {
    const time1 = new Date(c1).getTime();
    const time2 = new Date(c2).getTime();

    if (time1 === time2) {
      return 0;
    }

    return time1 < time2 ? 1 : -1;
  },
  'first created': ({ created: c1 }, { created: c2 }) => {
    const time1 = new Date(c1).getTime();
    const time2 = new Date(c2).getTime();

    if (time1 === time2) {
      return 0;
    }

    return time1 > time2 ? 1 : -1;
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
    return [value];
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
      .filter(
        ({ columnName }) =>
          columnName &&
          columnName !== 'Statistics' &&
          columnName !== 'Default Value',
      )
      .map(({ columnValue, columnName }) => ({
        [featuresMap.getByKey(columnName)]: Array.isArray(columnValue)
          ? columnName === 'Offline type' || columnName === 'Online type'
            ? columnValue[0]?.toUpperCase() || 'INT'
            : columnValue[0]
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

export const mapFeaturesToTable = (featureGroup?: FeatureGroup): FGRow[] => {
  if (featureGroup) {
    const { features, statisticColumns = [] } = featureGroup;
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

export const mapTags = (item?: DataEntity) => {
  if (item) {
    const { tags } = item;

    return tags.reduce(
      (acc, { name, tags: nestedTags }) => ({
        ...acc,
        ...{
          [name]: Object.entries(nestedTags).reduce(
            (calculated, [key, value]) => ({
              ...calculated,
              [key]: Array.isArray(value)
                ? value.map((value) => ({ value }))
                : value,
            }),
            {},
          ),
        },
      }),
      {},
    );
  }
  return {};
};

export const isServerBooleanType = (type?: string) => type === 'boolean';

export const getNormalizedValue = (value: any) => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'undefined') {
    return false;
  }
  if (value === '') {
    return null;
  }
  // if (!isNaN(value)) {
  //   return +value;
  // }
  return value;
};

const getType = (name: string, type?: string, required?: boolean) => {
  switch (type) {
    case 'integer':
      return (required ? integerRequired : integer).label(uppercaseFirst(name));
    case 'number':
      return (required ? floatRequired : float).label(uppercaseFirst(name));
    case 'string':
      return (required ? stringRequired : string).label(uppercaseFirst(name));
    default:
      return anyType;
  }
};

export const validateSchema = async (
  tags: { [key: string]: any },
  types: SchematisedTagEntity[],
  setError: any,
) => {
  let next = true;
  if (tags) {
    await Promise.resolve(
      await Promise.allSettled(
        Object.entries(tags).map(([key, tagValue]) => {
          const globalType = types.find(
            ({ name }: { name: string }) => name === key,
          );

          return Promise.allSettled(
            Object.entries(globalType?.properties || {}).map(
              async ([nestedKey, { type }]) => {
                const required = globalType?.required.includes(nestedKey);

                if (type === 'array') {
                  const nestedType =
                    globalType?.properties[nestedKey].items?.type;

                  const schema = getType(nestedKey, nestedType, required);

                  const values = tagValue[nestedKey] && tagValue[nestedKey];

                  for (let index = 0; index < values.length; index++) {
                    const value =
                      typeof values[index].value === 'undefined'
                        ? false
                        : values[index].value;

                    if (!value && !required && nestedType !== 'boolean') {
                      continue;
                    }

                    if (!(await schema.isValid(value))) {
                      next = false;

                      setError(`tags.${key}.${nestedKey}[${index}].value`, {
                        message: `${nestedKey} is invalid`,
                      });
                    }
                  }
                } else {
                  const schema = getType(nestedKey, type, required);

                  const value = tagValue.hasOwnProperty(nestedKey)
                    ? typeof tagValue[nestedKey] === 'undefined'
                      ? false
                      : tagValue[nestedKey]
                    : '';

                  if (
                    (value && required && !(await schema.isValid(value))) ||
                    (required && !value && !(await schema.isValid(value))) ||
                    (value && !required && !(await schema.isValid(value)))
                  ) {
                    next = false;

                    setError(`tags.${key}.${nestedKey}`, {
                      message: `${nestedKey} is invalid`,
                    });
                  }
                }
              },
            ),
          );
        }),
      ),
    );
  }

  return next;
};

export const getDatePickerTime = (
  time: Date,
  isFromDate = true,
  defaultDates: {
    fromDate?: Date;
    toDate?: Date;
  },
): string => {
  if (isToday(time)) {
    return 'today';
  }

  if (isFromDate && defaultDates.fromDate) {
    if (+time === +defaultDates.fromDate) {
      return format(time, 'dd MMM. y');
    }

    if (time.getHours() === 0 && time.getMinutes() === 0) {
      return format(time, 'dd MMM. y');
    }
  }

  if (defaultDates.toDate) {
    if (+time === +defaultDates.toDate) {
      return format(time, 'dd MMM. y');
    }

    if (time.getHours() === 23 && time.getMinutes() === 30) {
      return format(time, 'dd MMM. y');
    }
  }

  return format(time, 'dd MMM. y ha');
};

export const getMinDate = (activity: ActivityItem) => {
  return Object.values(activity).reduce((acc, next) => {
    const minDate = next.reduce(
      (nestAcc, { timestamp }) => (timestamp < nestAcc ? timestamp : nestAcc),
      +new Date(),
    );

    return minDate < acc ? minDate : acc;
  }, +new Date());
};

export const getMaxDate = (activity: ActivityItem) => {
  return Object.values(activity).reduce((acc, next) => {
    const maxDate = next.reduce(
      (nestAcc, { timestamp }) => (timestamp > nestAcc ? timestamp : nestAcc),
      0,
    );

    return maxDate > acc ? maxDate : acc;
  }, +new Date());
};
