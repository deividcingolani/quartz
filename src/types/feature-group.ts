import { DataEntity } from './index';
import { TrainingDataset } from './training-dataset';
import { User } from './user';
import { Expectation, Validation } from './expectation';

export enum FeatureType {
  stringUnknown = 'Unknown',
  int = 'int',
  intFractional = 'Fractional',
  bigInt = 'Integral',
  string = 'float',
  boolean = 'Boolean',
}

export enum ActivityType {
  job = 'JOB',
  commit = 'COMMIT',
  metadata = 'METADATA',
  statistics = 'STATISTICS',
  validations = 'VALIDATIONS',
}

export interface ActivityItem {
  [time: string]: ActivityItemData[];
}

export interface ActivityItemData {
  type: ActivityType;
  timestamp: number;
  href: string;
  user: User;
  metadata: string;
  statistics: {
    commitTime: string;
    href: string;
  };
  job: {
    config: any;
    creator: {
      href: string;
    };
    executions: {
      href: string;
      finalStatus: string;
      id: number;
    };
    href: string;
    name: string;
    jobType: string;
    id: number;
  };
  commit: {
    commitDateString: string;
    commitID: number;
    commitTime: number;
    href: string;
    rowsDeleted: number;
    rowsInserted: number;
    rowsUpdated: number;
  };
  validations: {
    expectationResults: {
      expectation: Expectation;
      results: {
        feature: string;
        message: string;
        rule: any;
        status: string;
        value: string;
      }[];
      status: string;
    }[];
  };
}

export interface Feature {
  defaultValue: string | number;
  description?: string;
  name: string;
  id: number;
  features: Feature[];
  partition: boolean;
  primary: boolean;
  type: FeatureType;
  onlineType?: FeatureType;
  label: boolean;
  index: number;
  featuregroup: FeatureGroup;
  basefeaturegroup: FeatureGroup;
  version: number;
  created?: string;
  parentProjectName: string;
  parentProjectId: number;
  featurestoreId: number;
  matchText: string;
  highlights: any;
  featureId: number;
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

export interface PropertyValue {
  description: string;
  type: string;
  items?: {
    type: string;
  };
}

export interface Property {
  [key: string]: PropertyValue;
}

export interface SchematisedTagEntity {
  id: number;
  name: string;
  description: string;
  properties: Property;
  required: string[];
  tags: any;
}

export interface SchematisedTag {
  value: string;
  name: string;
  type: string;
}

export interface FeatureGroupProvenance {
  td: TrainingDataset;
  info: Entry;
}

export interface ExpectationRule {
  level: string;
  min?: number;
  max?: number;
  name: string;
}

export interface FeatureGroup extends DataEntity {
  defaultStorage: string;
  statisticColumns: any;
  timeTravelFormat: string;
  validationType: string;
  provenance: FeatureGroupProvenance[];
  features: Feature[];
  parentProjectId: number;
  parentProjectName: string;
  featurestoreId: number;
  version: number;
  name: string;
  matchText: string;
  commits: any[];
  expectations: Expectation[];
  lastValidation?: Validation[];
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
  dataType: FeatureType;
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

export interface FeatureGroupRowItem {
  columnName: string;
  columnValue: string;
}

export interface FeatureGroupCommitDetail {
  href: string;
  items: unknown[];
  count: number;
  commitID: number;
  commitDateString: string;
  commitTime: number;
  rowsInserted: number;
  rowsUpdated: number;
  rowsDeleted: number;
}
