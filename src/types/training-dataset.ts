import { Feature } from './feature-group';

export interface ITrainingDataset {
  type: string;
  created: Date;
  creator: string;
  dataFormat: string;
  description: string;
  features: Feature[];
  labels: any[];
  featurestoreId: number;
  featurestoreName: string;
  fromQuery: boolean;
  id: number;
  inodeId: number;
  jobs: any[];
  location: string;
  name: string;
  splits: any[];
  storageConnectorId: number;
  storageConnectorName: string;
  storageConnectorType: string;
  trainingDatasetType: string;
  version: number;
}
