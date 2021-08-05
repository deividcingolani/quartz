/* eslint-disable import/no-cycle */
import { User } from './user';
import { DataEntity } from '.';
import { Entry } from './entry';
import { Feature } from './feature';
import { Expectation, Validation } from './expectation';
import { IStorageConnector } from './storage-connector';
import { ProvenanceState } from '../components/provenance/types';

// These feature types are valid only for statistics
// Deequ (the library we use to compute statistics)
// groups the different types into the followings:
export enum StatisticsFeatureType {
  stringUnknown = 'Unknown',
  int = 'int',
  intFractional = 'Fractional',
  bigInt = 'Integral',
  string = 'String',
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

export interface ListItem {
  id: string;
  selected: string[];
  tag?: SchematisedTagEntity;
}

export interface SchematisedTag {
  value: string;
  name: string;
  type: string;
}

export interface ExpectationRule {
  level: string;
  min?: number;
  max?: number;
  name: string;
}

export interface FeatureGroup extends DataEntity {
  statisticColumns: any;
  timeTravelFormat?: string;
  validationType?: string;
  provenance: ProvenanceState;
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
  storageConnector: IStorageConnector;
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
  dataType: StatisticsFeatureType;
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
