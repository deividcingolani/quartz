export enum FeatureType {
  float = 'float',
  int = 'int',
  bigInt = 'bigint',
  string = 'string',
  boolean = 'boolean',
}

export interface Feature {
  defaultValue: string | number;
  description?: string;
  name: string;
  partition: boolean;
  primary: boolean;
  type: FeatureType;
  onlineType?: FeatureType;
}

export interface Job {
  jobId: number;
  jobName: string;
  lastComputed: string;
  jobStatus: 'Succeeded' | 'Failed' | 'Running';
  featurestoreId: number;
  featuregroupId: number;
}

export interface FeatureGroup {
  created: string;
  creator: string;
  defaultStorage: string;
  descStatsEnabled: boolean;
  description: string;
  featCorrEnabled: boolean;
  featHistEnabled: boolean;
  features: Feature[];
  featurestoreId: number;
  featurestoreName: string;
  hudiEnabled: boolean;
  timeTravelFormat?: string;
  id: number;
  jobs: Job[]; // Todo: Update
  location: string;
  name: string;
  onlineEnabled: boolean;
  statisticColumns: string[];
  type: string;
  version: number;
  labels?: string[];
}

export interface FeatureGroupLabel {
  href: string;
  name: string;
  value?: string;
}

export interface HistogramItem {
  value: number | string;
  count: number;
  ratio: number;
}

export interface CorrelationItem {
  column: string;
  correlation: number;
}

export interface FeatureGroupStatistics {
  column: string;
  dataType: 'Integral' | 'none';
  isDataTypeInferred: boolean;
  completeness: number;
  distinctness: number;
  entropy: number;
  uniqueness: number;
  approximateNumDistinctValues: number;
  histogram: HistogramItem[];
  mean: number;
  maximum: number;
  minimum: number;
  sum: number;
  stdDev: number;
  correlations: CorrelationItem[];
  approxPercentiles: any; // Todo: update type
}

export interface FeatureGroupRow {
  [key: string]: string | number;
}

export interface FeatureGroupRowItem {
  columnName: string;
  columnValue: string;
}
