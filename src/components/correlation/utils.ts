import {
  CorrelationItem,
  FeatureGroupStatistics,
} from '../../types/feature-group';
import { Colors, CorrelationSortType, CorrelationValue } from './types';

export const generateTableCellsValues = (
  correlation: {
    [key: string]: FeatureGroupStatistics;
  },
  count: number,
) => {
  return Object.entries(correlation)
    .slice(0, count)
    .reduce((acc: CorrelationValue[], [key, { correlations }]) => {
      return [
        ...acc,
        ...Object.values(correlations)
          .map(({ column, correlation }) => {
            return {
              value: correlation,
              vertical: key,
              horizontal: column,
            };
          })
          .filter(({ horizontal }) =>
            Object.keys(correlation).slice(0, count).includes(horizontal),
          ),
      ];
    }, []);
};

export const compareCorrelationValues = (
  valueA: CorrelationValue,
  valueB: CorrelationValue,
) => {
  return (
    (valueA.horizontal === valueB.horizontal &&
      valueA.vertical === valueB.vertical) ||
    (valueA.horizontal === valueB.vertical &&
      valueA.vertical === valueB.horizontal)
  );
};

export const filterCorrelations = (
  selected: string[],
  correlation: { [key: string]: FeatureGroupStatistics },
) =>
  Object.keys(correlation).reduce(
    (acc, key) =>
      selected.includes(key)
        ? {
            ...acc,
            [key]: {
              ...correlation[key],
              correlations: correlation[key].correlations.reduce(
                (nestedAcc: CorrelationItem[], correlation) =>
                  selected.includes(correlation.column)
                    ? [...nestedAcc, correlation]
                    : nestedAcc,
                [],
              ),
            },
          }
        : acc,
    {},
  );

type SortFunc = (a: number, b: number) => number;

export const sortCorrelationsList = (
  sortType: CorrelationSortType,
  correlations: (CorrelationItem & { key: string })[],
) => {
  const sortMap = new Map<CorrelationSortType, SortFunc>([
    [
      CorrelationSortType.lowestAndHighest,
      (a, b) => -Math.sign(Math.abs(a) - Math.abs(b)),
    ],
    [CorrelationSortType.lowest, (a, b) => Math.sign(a - b)],
    [CorrelationSortType.highest, (a, b) => -Math.sign(a - b)],
    [
      CorrelationSortType.closestToZero,
      (a, b) => Math.sign(Math.abs(a) - Math.abs(b)),
    ],
  ]);

  const sortFunc = sortMap.get(sortType);

  if (sortFunc) {
    return correlations.sort(({ correlation: a }, { correlation: b }) =>
      sortFunc(a, b),
    );
  }

  return correlations;
};

export const filterCorrelationsByRange = (
  range: number[],
  correlation: { [key: string]: FeatureGroupStatistics },
) => {
  const [minA, maxA, minB, maxB] = range;

  const filtered = Object.keys(correlation).reduce((acc, key) => {
    const inRange = correlation[key].correlations.some(
      ({ correlation }) =>
        (correlation >= minA && correlation <= maxA) ||
        (correlation >= minB && correlation <= maxB),
    );

    return inRange ? { ...acc, [key]: correlation[key] } : acc;
  }, {});

  return Object.keys(filtered).reduce((acc, key) => {
    return {
      ...acc,
      [key]: {
        correlations: correlation[key].correlations.filter(
          ({ column, correlation }) =>
            (Object.keys(filtered).includes(column) &&
              correlation >= minA &&
              correlation <= maxA) ||
            (correlation >= minB && correlation <= maxB),
        ),
      },
    };
  }, {});
};

export const calcColor = (value: number) => {
  if (value > 0) {
    return Colors.gradientEndColor;
  }

  return Colors.gradientBeginColor;
};
