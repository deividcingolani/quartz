import { FeatureGroup } from '../../types/feature-group';
import labelValueMap from '../../utils/labelValueBind';

export enum ExpectationType {
  existing = 'Pick an existing expectation',
  new = 'Create a new expectation',
}

export const rulesMap = labelValueMap<{ [key: string]: string }>({
  HAS_SUM: 'Sum',
  HAS_MEAN: 'Mean',
  HAS_MIN: 'Minimum',
  HAS_MAX: 'Maximum',
  HAS_PATTERN: 'Pattern',
  HAS_ENTROPY: 'Entropy',
  HAS_DATATYPE: 'Datatype',
  HAS_SIZE: 'Number of row',
  HAS_UNIQUENESS: 'Uniqueness',
  IS_LESS_THAN: 'Is less than',
  IS_POSITIVE: 'Positive values',
  HAS_CORRELATION: 'Correlation',
  IS_CONTAINED_IN: 'Contained in',
  HAS_COMPLETENESS: 'Completeness',
  HAS_DISTINCTNESS: 'Distinctness',
  IS_GREATER_THAN: 'Is greater than',
  IS_NON_NEGATIVE: 'Non negative values',
  HAS_APPROX_QUANTILE: 'Approximate quantile',
  HAS_APPROX_COUNT_DISTINCT: 'Distinct values',
  HAS_STANDARD_DEVIATION: 'Standard deviation',
  HAS_UNIQUE_VALUE_RATIO: 'Value ratio is unique',
  HAS_MUTUAL_INFORMATION: 'Has mutual information',
  IS_LESS_THAN_OR_EQUAL_TO: 'Is less than or equal to',
  IS_GREATER_THAN_OR_EQUAL_TO: 'Is greater than or equal to',
  HAS_NUMBER_OF_DISTINCT_VALUES: 'Number of distinct value',
  // for greater than, less than...
  HAS_INEQUALITIES: 'Inequalities',
});

export enum RuleTypes {
  HAS_SUM = 'Sum',
  HAS_MEAN = 'Mean',
  HAS_MIN = 'Minimum',
  HAS_MAX = 'Maximum',
  HAS_PATTERN = 'Pattern',
  HAS_ENTROPY = 'Entropy',
  HAS_DATATYPE = 'Datatype',
  HAS_SIZE = 'Number of row',
  HAS_UNIQUENESS = 'Uniqueness',
  IS_LESS_THAN = 'Is less than',
  IS_POSITIVE = 'Positive values',
  HAS_CORRELATION = 'Correlation',
  IS_CONTAINED_IN = 'Contained in',
  HAS_COMPLETENESS = 'Completeness',
  HAS_DISTINCTNESS = 'Distinctness',
  IS_GREATER_THAN = 'Is greater than',
  IS_NON_NEGATIVE = 'Non negative values',
  HAS_APPROX_QUANTILE = 'Approximate quantile',
  HAS_APPROX_COUNT_DISTINCT = 'Distinct values',
  HAS_STANDARD_DEVIATION = 'Standard deviation',
  HAS_UNIQUE_VALUE_RATIO = 'Value ratio is unique',
  HAS_MUTUAL_INFORMATION = 'Has mutual information',
  IS_LESS_THAN_OR_EQUAL_TO = 'Is less than or equal to',
  IS_GREATER_THAN_OR_EQUAL_TO = 'Is greater than or equal to',
  HAS_NUMBER_OF_DISTINCT_VALUES = 'Number of distinct value',
  // for greater than, less than...
  HAS_INEQUALITIES = 'Inequalities',
}

export enum RuleTypesStrong {
  HAS_SUM = 'HAS_SUM',
  HAS_MAX = 'HAS_MAX',
  HAS_MIN = 'HAS_MIN',
  HAS_SIZE = 'HAS_SIZE',
  HAS_MEAN = 'HAS_MEAN',
  HAS_PATTERN = 'HAS_PATTERN',
  HAS_ENTROPY = 'HAS_ENTROPY',
  IS_POSITIVE = 'IS_POSITIVE',
  HAS_DATATYPE = 'HAS_DATATYPE',
  IS_LESS_THAN = 'IS_LESS_THAN',
  HAS_UNIQUENESS = 'HAS_UNIQUENESS',
  HAS_CORRELATION = 'HAS_CORRELATION',
  IS_CONTAINED_IN = 'IS_CONTAINED_IN',
  IS_GREATER_THAN = 'IS_GREATER_THAN',
  IS_NON_NEGATIVE = 'IS_NON_NEGATIVE',
  HAS_COMPLETENESS = 'HAS_COMPLETENESS',
  HAS_DISTINCTNESS = 'HAS_DISTINCTNESS',
  HAS_APPROX_QUANTILE = 'HAS_APPROX_QUANTILE',
  HAS_STANDARD_DEVIATION = 'HAS_STANDARD_DEVIATION',
  HAS_UNIQUE_VALUE_RATIO = 'HAS_UNIQUE_VALUE_RATIO',
  HAS_MUTUAL_INFORMATION = 'HAS_MUTUAL_INFORMATION',
  IS_LESS_THAN_OR_EQUAL_TO = 'IS_LESS_THAN_OR_EQUAL_TO',
  HAS_APPROX_COUNT_DISTINCT = 'HAS_APPROX_COUNT_DISTINCT',
  IS_GREATER_THAN_OR_EQUAL_TO = 'IS_GREATER_THAN_OR_EQUAL_TO',
  HAS_NUMBER_OF_DISTINCT_VALUES = 'HAS_NUMBER_OF_DISTINCT_VALUES',
  // for greater than, less than...
  HAS_INEQUALITIES = 'HAS_INEQUALITIES',
}

export const rulesMapToShort = labelValueMap<{ [key: string]: string }>({
  HAS_SUM: 'sum',
  HAS_MEAN: 'mean',
  HAS_MIN: 'minimum',
  HAS_MAX: 'maximum',
  HAS_PATTERN: 'pattern',
  HAS_ENTROPY: 'entropy',
  IS_LESS_THAN: '< than',
  IS_POSITIVE: 'positive',
  HAS_DATATYPE: 'datatype',
  IS_GREATER_THAN: '> than',
  HAS_SIZE: 'Number of row',
  HAS_UNIQUENESS: 'uniqueness',
  HAS_CORRELATION: 'correlation',
  IS_CONTAINED_IN: 'contained in',
  IS_NON_NEGATIVE: 'non negative',
  HAS_COMPLETENESS: 'completeness',
  HAS_DISTINCTNESS: 'distinctness',
  IS_LESS_THAN_OR_EQUAL_TO: '<= than',
  IS_GREATER_THAN_OR_EQUAL_TO: '>= than',
  HAS_APPROX_QUANTILE: 'approximate quantile',
  HAS_APPROX_COUNT_DISTINCT: 'distinct values',
  HAS_STANDARD_DEVIATION: 'standard deviation',
  HAS_UNIQUE_VALUE_RATIO: 'value ratio is unique',
  HAS_NUMBER_OF_DISTINCT_VALUES: 'distinct value',
  HAS_MUTUAL_INFORMATION: 'mutual information',
});

export interface ExpectationData {
  name: string;
  description: string;
  features: string[];
  rules: FormRule[];
  type: ExpectationType;
  expectation: string[];
  featureGroups: FeatureGroup[];
}

export enum ExpectationTypeMatch {
  all = 'all',
  matching = 'matching features only',
}

export interface FormRule {
  id: string;
  type?: string;
  severity: string;

  min?: string;
  max?: string;
  exact?: string;
  values?: string;
  match?: string[];
  pattern?: string;
  datatype?: string[];
  legalValues?: string;
  inequality?: string[];
}
