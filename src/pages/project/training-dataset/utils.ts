import { FeatureGroupFilter, FeatureGroupJoin } from './types';
import { Feature } from '../../../types/feature-group';
import labelValueMap from '../../../utils/labelValueBind';
import { FeatureGroupBasket } from '../../../store/models/localManagement/basket.model';

const mapFeaturesToName = (features: Feature[]) =>
  features.map(({ name }) => ({ name }));

const mapFeatureNamesToName = (names: string[][]) =>
  names.map(([name]) => ({ name }));

export const mapJoins = (
  joins: FeatureGroupJoin[],
  features: FeatureGroupBasket[],
) => {
  const [first, ...rest] = joins;
  const { firstFg, firstFgJoinKeys, secondFg, secondFgJoinKeys } = first;

  if (firstFg && firstFgJoinKeys && secondFg && secondFgJoinKeys) {
    return {
      leftFeatureGroup: {
        id: firstFg.id,
      },
      leftFeatures: mapFeaturesToName(
        features.find(({ fg: { id } }) => id === firstFg.id)?.features || [],
      ),
      joins: [
        {
          query: {
            leftFeatureGroup: { id: secondFg.id },
            leftFeatures: mapFeaturesToName(
              features.find(({ fg: { id } }) => id === secondFg.id)?.features ||
                [],
            ),
          },
          leftOn: mapFeatureNamesToName(firstFgJoinKeys),
          rightOn: mapFeatureNamesToName(secondFgJoinKeys),
          type: 'INNER',
        },
        ...rest.map(({ firstFgJoinKeys, secondFgJoinKeys, secondFg }) => ({
          query: {
            leftFeatureGroup: { id: secondFg?.id },
            leftFeatures: mapFeaturesToName(
              features.find(({ fg: { id } }) => id === secondFg?.id)
                ?.features || [],
            ),
          },
          leftOn: mapFeatureNamesToName(firstFgJoinKeys),
          rightOn: mapFeatureNamesToName(secondFgJoinKeys),
          type: 'INNER',
        })),
      ],
    };
  }
};

const getFilterName = (operation: string) => {
  const namesMap = new Map<string, string>([
    ['=', 'EQUALS'],
    ['<', 'LESS_THAN'],
    ['!=', 'NOT_EQUALS'],
    ['>', 'GREATER_THAN'],
    ['≤', 'LESS_THAN_OR_EQUAL'],
    ['≥', 'GREATER_THAN_OR_EQUAL'],
  ]);

  return namesMap.get(operation);
};

export const mapFilters = (
  filters: FeatureGroupFilter[],
  currentIndex = 0,
): any => {
  if (currentIndex >= filters.length) {
    return null;
  }

  const filter = filters[currentIndex];

  return {
    type: 'AND',
    rightLogic: null,
    leftFilter: null,
    rightFilter: {
      value: filter?.value,
      feature: {
        name: filter?.features && filter.features[0],
        featureGroupId: filter.fg?.id,
      },
      condition: getFilterName(filter?.operation[0]),
    },
    leftLogic: mapFilters(filters, currentIndex + 1),
  };
};

export const createStatistics = (
  features: Feature[],
  enabledColumns: string[],
) => {
  return features.map(({ name }) => ({
    row: [
      {
        columnValue: name,
        columnName: 'Name',
      },
      {
        columnValue: !enabledColumns.length || enabledColumns.includes(name),
        columnName: 'Statistics',
      },
    ],
  }));
};

export const dataFormatMap = labelValueMap<{ [key: string]: string }>({
  'Tf Record': 'tfrecord',
  CSV: 'csv',
  Parquet: 'parquet',
  TSV: 'tsv',
  ORC: 'orc',
  Avro: 'avro',
});

export const validateJoins = (joins: FeatureGroupJoin[], setError: any) => {
  let result = true;

  joins.forEach(
    ({ firstFgJoinKeys, firstFg, secondFgJoinKeys, secondFg }, index) => {
      if (!index && !firstFg) {
        setError(`joins[${index}].firstFg`, {
          message: 'Select a feature group',
        });
        result = false;
      }
      if (!secondFg) {
        setError(`joins[${index}].secondFg`, {
          message: 'Select a feature group',
        });
        result = false;
      }
      firstFgJoinKeys.forEach((value, nextIndex) => {
        if (!value?.length) {
          setError(`joins[${index}].firstFgJoinKeys[${nextIndex}].key`, {
            message: 'Select a join key',
          });
          result = false;
        }
      });
      secondFgJoinKeys.forEach((value, nextIndex) => {
        if (!value?.length) {
          setError(`joins[${index}].secondFgJoinKeys[${nextIndex}].key`, {
            message: 'Select a join key',
          });
          result = false;
        }
      });
    },
  );

  return result;
};

export const validateFilters = (
  filters: FeatureGroupFilter[],
  setError: any,
) => {
  let result = true;

  filters.forEach(({ fg, features, value }, index) => {
    if (!fg) {
      setError(`filters[${index}].fg`, { message: 'Select feature group' });
      result = false;
    }
    if (!features?.length) {
      setError(`filters[${index}].features`, { message: 'Select feature' });
      result = false;
    }
    if (!value || Number.isNaN(+value)) {
      setError(`filters[${index}].value`, { message: 'Float expected' });
      result = false;
    }
  });

  return result;
};
