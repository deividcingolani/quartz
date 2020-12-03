import { DataEntity } from './index';

export interface ITrainingDataset extends DataEntity {
  dataFormat: string;
  fromQuery: boolean;
  inodeId: number;
  splits: any[];
  storageConnectorId: number;
  storageConnectorName: string;
  storageConnectorType: string;
  trainingDatasetType: string;
}
