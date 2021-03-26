// eslint-disable-next-line import/no-unresolved
import { FieldName } from 'react-hook-form/dist/types/fields';
// eslint-disable-next-line import/no-unresolved
import { ErrorOption } from 'react-hook-form/dist/types/errors';

import { MatchTypes } from './forms/RuleFormByType';
import { Expectation, ServerRule } from '../../types/expectation';
import {
  ExpectationData,
  FormRule,
  rulesMap,
  RuleTypes,
  RuleTypesStrong,
} from './types';
import { FeatureGroupViewState } from '../../store/models/feature/featureGroupView.model';

const getRestRuleData = (data: Omit<FormRule, 'severity'>) => {
  const typesMap = [
    {
      types: [
        RuleTypes.HAS_MIN,
        RuleTypes.HAS_MAX,
        RuleTypes.HAS_SUM,
        RuleTypes.HAS_MEAN,
        RuleTypes.HAS_SIZE,
        RuleTypes.HAS_ENTROPY,
        RuleTypes.IS_LESS_THAN,
        RuleTypes.HAS_UNIQUENESS,
        RuleTypes.IS_GREATER_THAN,
        RuleTypes.HAS_CORRELATION,
        RuleTypes.HAS_COMPLETENESS,
        RuleTypes.HAS_DISTINCTNESS,
        RuleTypes.HAS_APPROX_QUANTILE,
        RuleTypes.HAS_STANDARD_DEVIATION,
        RuleTypes.IS_LESS_THAN_OR_EQUAL_TO,
        RuleTypes.HAS_APPROX_COUNT_DISTINCT,
        RuleTypes.IS_GREATER_THAN_OR_EQUAL_TO,
        RuleTypes.HAS_NUMBER_OF_DISTINCT_VALUES,
      ],
      fn: ({ max, match, exact, min }: Omit<FormRule, 'severity'>) => {
        if (match && match[0] === MatchTypes.exactly && exact) {
          return {
            min: +exact,
            max: +exact,
          };
        }

        if (min && max) {
          if (+min > +max) {
            return {
              min: +max,
              max: +min,
            };
          }

          return {
            min: +min,
            max: +max,
          };
        }

        return {
          min: 0,
          max: 0,
        };
      },
    },
    {
      types: [
        RuleTypes.IS_POSITIVE,
        RuleTypes.IS_NON_NEGATIVE,
        RuleTypes.HAS_MUTUAL_INFORMATION,
      ],
      fn: ({ min, max, exact, match }: Omit<FormRule, 'severity'>) => {
        if (match && match[0] === MatchTypes.exactly && exact) {
          return {
            min: +exact / 100,
            max: +exact / 100,
          };
        }

        if (min && max) {
          if (+min > +max) {
            return {
              min: +max / 100,
              max: +min / 100,
            };
          }

          return {
            min: +min / 100,
            max: +max / 100,
          };
        }

        return {
          min: 0,
          max: 0,
        };
      },
    },
    {
      types: [RuleTypes.HAS_PATTERN],
      fn: ({ pattern }: Omit<FormRule, 'severity'>) => {
        return {
          pattern,
        };
      },
    },
    {
      types: [RuleTypes.IS_CONTAINED_IN],
      fn: ({ legalValues }: Omit<FormRule, 'severity'>) => {
        return {
          legalValues: legalValues?.split(';').map((value) => value.trim()),
        };
      },
    },
  ];

  const fn = typesMap.find(
    ({ types }) => data.type && types.includes(data.type as RuleTypes),
  )?.fn;

  if (fn) {
    return fn(data);
  }

  return {};
};

export const mapRules = (rules: FormRule[]) => {
  return rules.map(({ severity, type, inequality, ...rest }) => {
    if (
      type === RuleTypes.HAS_INEQUALITIES &&
      inequality &&
      inequality.length
    ) {
      return {
        level: severity === 'alert' ? 'ERROR' : 'WARNING',
        name: rulesMap.getByValue(inequality[0]),
        ...getRestRuleData({ ...rest, type: inequality[0] }),
      };
    }
    return {
      level: severity === 'alert' ? 'ERROR' : 'WARNING',
      name: type && rulesMap.getByValue(type),
      ...getRestRuleData({ ...rest, type }),
    };
  });
};

export const mapRulesToForm = (rules: ServerRule[]) => {
  const typesMap = [
    {
      types: [
        RuleTypes.HAS_MIN,
        RuleTypes.HAS_MAX,
        RuleTypes.HAS_SUM,
        RuleTypes.HAS_MEAN,
        RuleTypes.HAS_SIZE,
        RuleTypes.HAS_ENTROPY,
        RuleTypes.HAS_UNIQUENESS,
        RuleTypes.HAS_CORRELATION,
        RuleTypes.HAS_COMPLETENESS,
        RuleTypes.HAS_DISTINCTNESS,
        RuleTypes.HAS_APPROX_QUANTILE,
        RuleTypes.HAS_STANDARD_DEVIATION,
        RuleTypes.HAS_APPROX_COUNT_DISTINCT,
        RuleTypes.HAS_NUMBER_OF_DISTINCT_VALUES,
      ],
      fn: ({ max, min }: ServerRule) => {
        if (min === max) {
          return {
            exact: String(max),
            match: [MatchTypes.exactly],
          };
        }

        if (!min) {
          return {
            exact: String(max),
            match: [MatchTypes.exactly],
          };
        }

        if (!max) {
          return {
            exact: String(min),
            match: [MatchTypes.exactly],
          };
        }

        return {
          min: String(min),
          max: String(max),
          match: [MatchTypes.between],
        };
      },
    },
    {
      types: [
        RuleTypes.IS_POSITIVE,
        RuleTypes.IS_NON_NEGATIVE,
        RuleTypes.HAS_MUTUAL_INFORMATION,
      ],
      fn: ({ max, min }: ServerRule) => {
        if (min === max) {
          return {
            exact: max ? String(max * 100) : String(max),
            match: [MatchTypes.exactly],
          };
        }

        if (!min) {
          return {
            exact: max ? String(max * 100) : String(max),
            match: [MatchTypes.exactly],
          };
        }

        if (!max) {
          return {
            exact: min ? String(min * 100) : String(min),
            match: [MatchTypes.exactly],
          };
        }

        return {
          min: min ? String(min * 100) : String(min),
          max: max ? String(max * 100) : String(max),
          match: [MatchTypes.between],
        };
      },
    },
    {
      types: [RuleTypes.HAS_PATTERN],
      fn: ({ pattern }: ServerRule) => {
        return {
          pattern,
        };
      },
    },
    {
      types: [RuleTypes.IS_CONTAINED_IN],
      fn: ({ legalValues }: ServerRule) => {
        return {
          legalValues: legalValues?.join(' ; '),
        };
      },
    },
  ];

  return rules.map(({ name, level, ...rest }) => {
    const fn = typesMap.find(({ types }) =>
      types.includes(rulesMap.getByKey(name) as RuleTypes),
    )?.fn;

    if (
      [
        RuleTypesStrong.IS_LESS_THAN,
        RuleTypesStrong.IS_GREATER_THAN,
        RuleTypesStrong.IS_LESS_THAN_OR_EQUAL_TO,
        RuleTypesStrong.IS_GREATER_THAN_OR_EQUAL_TO,
      ].includes(name as RuleTypesStrong)
    ) {
      return {
        type: rulesMap.getByKey(RuleTypesStrong.HAS_INEQUALITIES),
        inequality: name && [rulesMap.getByKey(name)],
        severity: level === 'ERROR' ? 'alert' : 'warning',
        ...(!!fn && fn(rest as never)),
      };
    }
    return {
      type: rulesMap.getByKey(name),
      severity: level === 'ERROR' ? 'alert' : 'warning',
      ...(!!fn && fn(rest as never)),
    };
  });
};

const isNumber = (value: any) => value && !Number.isNaN(+value);

export const validateRules = (
  rules: FormRule[],
  features: string[],
  setError: (name: FieldName<ExpectationData>, error: ErrorOption) => void,
): { validated: boolean } => {
  let result = true;

  rules.forEach((rule, index) => {
    if (!rule.type) {
      setError(`rules[${index}].ruleType`, { message: 'Select type' });
      result = false;
    } else {
      if (
        [
          RuleTypes.HAS_MIN,
          RuleTypes.HAS_MAX,
          RuleTypes.HAS_SUM,
          RuleTypes.HAS_MEAN,
          RuleTypes.HAS_SIZE,
          RuleTypes.HAS_ENTROPY,
          RuleTypes.IS_POSITIVE,
          RuleTypes.IS_LESS_THAN,
          RuleTypes.HAS_UNIQUENESS,
          RuleTypes.IS_NON_NEGATIVE,
          RuleTypes.IS_GREATER_THAN,
          RuleTypes.HAS_CORRELATION,
          RuleTypes.HAS_COMPLETENESS,
          RuleTypes.HAS_DISTINCTNESS,
          RuleTypes.HAS_APPROX_QUANTILE,
          RuleTypes.HAS_MUTUAL_INFORMATION,
          RuleTypes.HAS_STANDARD_DEVIATION,
          RuleTypes.IS_LESS_THAN_OR_EQUAL_TO,
          RuleTypes.HAS_APPROX_COUNT_DISTINCT,
          RuleTypes.IS_GREATER_THAN_OR_EQUAL_TO,
          RuleTypes.HAS_NUMBER_OF_DISTINCT_VALUES,
        ].includes(rule.type as RuleTypes)
      ) {
        const { min, max, exact, match } = rule;

        if (match && match[0] === MatchTypes.between) {
          if (!isNumber(min)) {
            setError(`rules[${index}].min`, { message: 'Number expected' });
            result = false;
          }
          if (!isNumber(max)) {
            setError(`rules[${index}].max`, { message: 'Number expected' });
            result = false;
          }
        } else {
          if (!isNumber(exact)) {
            setError(`rules[${index}].exact`, {
              message: 'Number expected',
            });
            result = false;
          }
        }
      }
      if ([RuleTypes.HAS_CORRELATION].includes(rule.type as RuleTypes)) {
        const { min, max, exact, match } = rule;

        if (match && match[0] === MatchTypes.between) {
          if (!min || Number.isNaN(+min)) {
            setError(`rules[${index}].min`, { message: 'Number expected' });
            result = false;
          } else if (+min > 1 || +min < -1) {
            setError(`rules[${index}].min`, {
              message: 'A pearson correlation is contained between -1 and 1',
            });
            result = false;
          }
          if (!isNumber(max)) {
            setError(`rules[${index}].max`, { message: 'Number expected' });
            result = false;
          } else if (max && (+max > 1 || +max < -1)) {
            setError(`rules[${index}].max`, {
              message: 'A pearson correlation is contained between -1 and 1',
            });
            result = false;
          }
        } else {
          if (!isNumber(exact)) {
            setError(`rules[${index}].exact`, {
              message: 'Number expected',
            });
            result = false;
          } else if (exact && (+exact > 1 || +exact < -1)) {
            setError(`rules[${index}].exact`, {
              message: 'A pearson correlation is contained between -1 and 1',
            });
            result = false;
          }
        }
      }
      if ([RuleTypes.HAS_PATTERN].includes(rule.type as RuleTypes)) {
        const { pattern } = rule;

        if (!pattern) {
          setError(`rules[${index}].pattern`, {
            message: 'Pattern is required',
          });
          result = false;
        }
      }
      if ([RuleTypes.IS_CONTAINED_IN].includes(rule.type as RuleTypes)) {
        const { legalValues } = rule;

        if (!legalValues) {
          setError(`rules[${index}].legalValues`, {
            message: 'Values is required',
          });
          result = false;
        }
      }
      if (
        [
          RuleTypes.IS_LESS_THAN,
          RuleTypes.IS_GREATER_THAN,
          RuleTypes.IS_LESS_THAN_OR_EQUAL_TO,
          RuleTypes.IS_GREATER_THAN_OR_EQUAL_TO,
        ].includes(rule.type as RuleTypes)
      ) {
        const { min, max } = rule;

        if (min && (+min < 0 || +min > 1)) {
          setError(`rules[${index}].min`, {
            message: 'Value should be between 0 and 1',
          });
          result = false;
        }

        if (max && (+max < 0 || +max > 1)) {
          setError(`rules[${index}].min`, {
            message: 'Value should be between 0 and 1',
          });
          result = false;
        }

        if (features?.length < 2) {
          setError(`features`, {
            message:
              'At least two features need be provided in the expectation features',
          });
          result = false;
        }
      }
      if (
        [
          RuleTypes.HAS_MUTUAL_INFORMATION,
          RuleTypes.IS_POSITIVE,
          RuleTypes.IS_NON_NEGATIVE,
        ].includes(rule.type as RuleTypes)
      ) {
        const { min, max, exact, match } = rule;

        if (match && match[0] === MatchTypes.between) {
          if (!min || Number.isNaN(+min)) {
            setError(`rules[${index}].min`, { message: 'Number expected' });
            result = false;
          } else if (+min > 100 || +min < 0) {
            setError(`rules[${index}].min`, {
              message: 'Values are expected to be between 0 and 100',
            });
            result = false;
          }
          if (!isNumber(max)) {
            setError(`rules[${index}].max`, { message: 'Number expected' });
            result = false;
          } else if (max && (+max > 100 || +max < 0)) {
            setError(`rules[${index}].max`, {
              message: 'Values are expected to be between 0 and 100',
            });
            result = false;
          }
        } else {
          if (!isNumber(exact)) {
            setError(`rules[${index}].exact`, {
              message: 'Number expected',
            });
            result = false;
          } else if (exact && (+exact > 100 || +exact < 0)) {
            setError(`rules[${index}].exact`, {
              message: 'Values are expected to be between 0 and 100',
            });
            result = false;
          }
        }
      }
    }
  });

  return { validated: result };
};

export const getRuleDescription = (rule: FormRule, features: string[]) => {
  const isShowFeatures = features?.length === 2;
  const [firstFeature, secondFeature] = features;

  const descMap = new Map<RuleTypes, Function>([
    [
      RuleTypes.HAS_MEAN,
      ({ min, max, match, exact }: FormRule) =>
        match && match[0] === MatchTypes.exactly
          ? `Assert that the mean is exactly equal to ${exact || '-'}`
          : `Assert that the mean is between ${min || '-'} and ${max || '-'}`,
    ],
    [
      RuleTypes.HAS_MIN,
      ({ min, max, match, exact }: FormRule) =>
        match && match[0] === MatchTypes.exactly
          ? `Assert that the minimum is exactly equal to ${exact || '-'}`
          : `Assert that the minimum is between ${min || '-'} and ${
              max || '-'
            }`,
    ],
    [
      RuleTypes.HAS_MAX,
      ({ min, max, match, exact }: FormRule) =>
        match && match[0] === MatchTypes.exactly
          ? `Assert that the maximum is exactly equal to ${exact || '-'}`
          : `Assert that the maximum is between ${min || '-'} and ${
              max || '-'
            }`,
    ],
    [
      RuleTypes.HAS_SUM,
      ({ min, max, match, exact }: FormRule) =>
        match && match[0] === MatchTypes.exactly
          ? `Assert that the sum is exactly equal to ${exact || '-'}`
          : `Assert that the sum is between ${min || '-'} and ${max || '-'}`,
    ],
    [
      RuleTypes.HAS_COMPLETENESS,
      ({ min, max, match, exact }: FormRule) =>
        match && match[0] === MatchTypes.exactly
          ? `Assert that the completeness of a single or combined set of features is exactly equal to ${
              exact || '-'
            }`
          : `Assert that the completeness of a single or combined set of features is between ${
              min || '-'
            } and ${max || '-'}`,
    ],
    [
      RuleTypes.HAS_UNIQUENESS,
      ({ min, max, match, exact }: FormRule) =>
        match && match[0] === MatchTypes.exactly
          ? `Assert that the uniqueness of a single or combined set of features is exactly equal to ${
              exact || '-'
            }`
          : `Assert that the uniqueness of a single or combined set of features is between ${
              min || '-'
            } and ${max || '-'}`,
    ],
    [
      RuleTypes.HAS_DISTINCTNESS,
      ({ min, max, match, exact }: FormRule) =>
        match && match[0] === MatchTypes.exactly
          ? `Assert that the distinctness of a single or combined set of features is exactly equal to ${
              exact || '-'
            }`
          : `Assert that the distinctness of a single or combined set of features is between ${
              min || '-'
            } and ${max || '-'}`,
    ],
    [
      RuleTypes.HAS_ENTROPY,
      ({ min, max, match, exact }: FormRule) =>
        match && match[0] === MatchTypes.exactly
          ? `Assert that the entropy is exactly equal to ${exact || '-'}`
          : `Assert that the entropy is between ${min || '-'} and ${
              max || '-'
            }`,
    ],
    [
      RuleTypes.HAS_APPROX_QUANTILE,
      ({ min, max, match, exact }: FormRule) =>
        match && match[0] === MatchTypes.exactly
          ? `Assert that the approximate quantile is exactly equal to ${
              exact || '-'
            }`
          : `Assert that the approximate quantile is between ${
              min || '-'
            } and ${max || '-'}`,
    ],
    [
      RuleTypes.HAS_STANDARD_DEVIATION,
      ({ min, max, match, exact }: FormRule) =>
        match && match[0] === MatchTypes.exactly
          ? `Assert that the standard deviation is exactly equal to ${
              exact || '-'
            }`
          : `Assert that the standard deviation is between ${min || '-'} and ${
              max || '-'
            }`,
    ],
    [
      RuleTypes.HAS_NUMBER_OF_DISTINCT_VALUES,
      ({ min, max, match, exact }: FormRule) =>
        match && match[0] === MatchTypes.exactly
          ? `Assert that the number of distinct values is exactly equal to ${
              exact || '-'
            }`
          : `Assert that the number of distinct values is between ${
              min || '-'
            } and ${max || '-'}`,
    ],
    [
      RuleTypes.HAS_SIZE,
      ({ min, max, match, exact }: FormRule) =>
        match && match[0] === MatchTypes.exactly
          ? `Assert on the number of rows of the dataframe is exactly equal to ${
              exact || '-'
            }`
          : `Assert on the number of rows of the dataframe is between ${
              min || '-'
            } and ${max || '-'}`,
    ],
    [
      RuleTypes.HAS_APPROX_COUNT_DISTINCT,
      ({ min, max, match, exact }: FormRule) =>
        match && match[0] === MatchTypes.exactly
          ? `Assert that the approximate count distinct is exactly equal to ${
              exact || '-'
            }`
          : `Assert that the approximate count distinct is between ${
              min || '-'
            } and ${max || '-'}`,
    ],
    [
      RuleTypes.HAS_MUTUAL_INFORMATION,
      ({ min, max, exact, match }: FormRule) => {
        if (!isShowFeatures) {
          return 'Assert on the mutual information between 2 features.';
        }

        return match && match[0] === MatchTypes.exactly
          ? `Assert on having exactly ${
              exact || '-'
            }% of the mutual information between ${firstFeature} and ${secondFeature}`
          : `Assert on having between ${min || '-'}% and ${
              max || '-'
            }% of the mutual information between ${firstFeature} and ${secondFeature}`;
      },
    ],
    [
      RuleTypes.HAS_CORRELATION,
      () =>
        isShowFeatures
          ? `Assert on the pearson correlation between ${firstFeature} and ${secondFeature}`
          : `Assert on the pearson correlation between 2 features.`,
    ],
    [
      RuleTypes.HAS_PATTERN,
      () =>
        `Assert on the average compliance of the feature to the regular expression.`,
    ],
    [
      RuleTypes.HAS_DATATYPE,
      () =>
        `Assert on the fraction of rows that conform to the given data type.`,
    ],
    [
      RuleTypes.IS_NON_NEGATIVE,
      ({ match, exact, min, max }: FormRule) =>
        match && match[0] === MatchTypes.exactly
          ? `Assert that exactly ${
              exact || '-'
            }% of value are non negative values.`
          : `Assert that between ${min || '-'}% and ${
              max || '-'
            }% of value are non negative values.`,
    ],
    [
      RuleTypes.IS_POSITIVE,
      ({ match, exact, min, max }: FormRule) =>
        match && match[0] === MatchTypes.exactly
          ? `Assert that exactly ${exact || '-'}% of value are positive values.`
          : `Assert that between ${min || '-'}% and ${
              max || '-'
            }% of value are positive values.`,
    ],
    [
      RuleTypes.IS_LESS_THAN,
      () =>
        isShowFeatures
          ? `Assert on ${firstFeature} values being less than those of ${secondFeature}.`
          : `Assert on feature A values being less than those of feature B.`,
    ],
    [
      RuleTypes.IS_LESS_THAN_OR_EQUAL_TO,
      () =>
        isShowFeatures
          ? `Assert on ${firstFeature} values being less or equal to those of ${secondFeature}.`
          : `Assert on feature A values being less or equal to those of feature B.`,
    ],
    [
      RuleTypes.IS_GREATER_THAN,
      () =>
        isShowFeatures
          ? `Assert on ${firstFeature} values being greater than those of ${secondFeature}.`
          : `Assert on feature A values being greater than those of feature B. `,
    ],
    [
      RuleTypes.IS_GREATER_THAN_OR_EQUAL_TO,
      () =>
        isShowFeatures
          ? `Assert on ${firstFeature} values being greater or equal to those of ${secondFeature}.`
          : `Assert on feature A values being greater or equal to those of feature B.`,
    ],
    [
      RuleTypes.IS_CONTAINED_IN,
      () =>
        `Assert that every non-null value of feature is contained in a set of predefined values.`,
    ],
  ]);

  const matchFunction = descMap.get(rule.type as RuleTypes);

  if (matchFunction) {
    return matchFunction(rule);
  }
};

export const getNewRuleProps = (type: RuleTypes) => {
  if (type === RuleTypes.HAS_DATATYPE) {
    return {
      datatype: ['String'],
    };
  }

  return {
    match: ['exactly'],
  };
};

export const filterExpectations = (
  expectations: Expectation[],
  featureGroup: FeatureGroupViewState,
) =>
  expectations.filter(({ features }) =>
    featureGroup?.features.some(({ name }) => features.includes(name)),
  );

export const getMatchingFeatures = (
  featureGroup: FeatureGroupViewState,
  features?: string[],
) =>
  features?.filter((name) =>
    featureGroup?.features.map(({ name }) => name).includes(name),
  );

export const getNotMatchingFeatures = (
  featureGroup: FeatureGroupViewState,
  features?: string[],
) =>
  features?.filter(
    (name) => !featureGroup?.features.map(({ name }) => name).includes(name),
  );

const atLeastOneNotMatch = (firstObj: any, secondObj: any, props: string[]) =>
  props.some((property) => {
    const value1 = firstObj[property];
    const value2 = secondObj[property];

    if (!value1 || !value2) {
      return false;
    }

    if (Array.isArray(value1) && Array.isArray(value2)) {
      return value1[0] !== value2[0];
    }

    return value1 !== value2;
  });

export const getEditedRulesCount = (prevData: FormRule[], data: FormRule[]) => {
  const restData = data.filter(({ type }) =>
    prevData.map(({ type }) => type).includes(type),
  );

  return restData.reduce((acc, rule) => {
    const prevRule = prevData.find(({ type }) => type === rule.type);

    if (!prevRule) {
      return acc;
    }

    return atLeastOneNotMatch(rule, prevRule, [
      'min',
      'max',
      'match',
      'exact',
      'severity',
    ])
      ? acc + 1
      : acc;
  }, 0);
};

export const getShortRuleValue = (rule: ServerRule) => {
  const typesMap = [
    {
      types: [RuleTypes.HAS_MIN],
      fn: ({ min }: ServerRule) => min,
    },
    {
      types: [RuleTypes.HAS_MAX],
      fn: ({ max }: ServerRule) => max,
    },
    {
      types: [
        RuleTypes.HAS_SUM,
        RuleTypes.HAS_MEAN,
        RuleTypes.HAS_SIZE,
        RuleTypes.HAS_ENTROPY,
        RuleTypes.HAS_UNIQUENESS,
        RuleTypes.HAS_CORRELATION,
        RuleTypes.HAS_COMPLETENESS,
        RuleTypes.HAS_DISTINCTNESS,
        RuleTypes.HAS_APPROX_QUANTILE,
        RuleTypes.HAS_STANDARD_DEVIATION,
        RuleTypes.HAS_APPROX_COUNT_DISTINCT,
        RuleTypes.HAS_NUMBER_OF_DISTINCT_VALUES,
      ],
      fn: ({ max, min }: ServerRule) => `${min} - ${max}`,
    },
    {
      types: [RuleTypes.HAS_PATTERN],
      fn: ({ pattern }: ServerRule) => pattern,
    },
    {
      types: [RuleTypes.IS_CONTAINED_IN],
      fn: ({ legalValues }: ServerRule) => legalValues?.join('; '),
    },
  ];

  const fn = typesMap.find(({ types }) =>
    types.includes(rulesMap.getByKey(rule.name) as RuleTypes),
  )?.fn;

  if (fn) {
    return fn(rule);
  }

  const { level, name, ...rest } = rule;

  // @ts-ignore
  return rest[Object.keys(rest)[0]];
};
