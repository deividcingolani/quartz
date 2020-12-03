import { DataEntity } from './index';
import { ITrainingDataset } from './training-dataset';

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

export interface Entry {
  key: string;
  value: any;
}

export interface EntryType {
  entry: Entry[];
}

export interface Provenance {
  count: number;
  in: EntryType;
  out: EntryType;
  items?: Provenance[];
}

export interface SchematisedTag {
  value: string;
  name: string;
  type: string;
}

export interface FeatureGroupProvenance {
  td: ITrainingDataset;
  info: Entry;
}

export interface SchematisedTag {
  value: string;
  name: string;
  type: string;
}

export interface FeatureGroup extends DataEntity {
  defaultStorage: string;
  descStatsEnabled: boolean;
  featCorrEnabled: boolean;
  featHistEnabled: boolean;
  hudiEnabled: boolean;
  statisticColumns: any;
  timeTravelFormat: string;
  provenance: FeatureGroupProvenance[];
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
