/* eslint-disable import/no-cycle */
import { Entry } from './entry';
import { ProvenanceState } from '../components/provenance/types';
import { FeatureGroup } from './feature-group';
import { DataEntity } from './index';
import { IStorageConnector } from './storage-connector';

export interface TrainingDatasetFeature {
  name: string;
  type: string;
  description: string;
  featuregroup: FeatureGroup;
  label: boolean;
  index: number;
}

export enum TrainingDatasetType {
  hopsfs = 'HOPSFS_TRAINING_DATASET',
  external = 'EXTERNAL_TRAINING_DATASET',
}

export interface TrainingDatasetProvenance {
  fg: FeatureGroup;
  info: Entry;
}

export interface TrainingDataset extends DataEntity {
  type: string;
  created: string;
  updated: string;
  creator: string;
  dataFormat: string;
  description: string;
  labels: any[];
  featurestoreId: number;
  featurestoreName: string;
  fromQuery: boolean;
  inodeId: number;
  storageConnectorId: number;
  storageConnectorName: string;
  storageConnectorType: string;
  trainingDatasetType: TrainingDatasetType;
  version: number;
  provenance: ProvenanceState;
  parentProjectId: number;
  parentProjectName: string;
  storageConnector: IStorageConnector;
}

export interface TrainingDatasetQuery {
  query: string;
  queryOnline: string;
  trainingDatasetType: string;
  parentProjectId: number;
  parentProjectName: string;
  featurestoreId: number;
  version: number;
  name: string;
  matchText: string;
}

export interface TrainingDatasetComputeConf {
  query: any;
}
