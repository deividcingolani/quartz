export interface FeatureStore {
  created: string;
  featurestoreDescription: string;
  featurestoreId: number;
  featurestoreName: string;
  hdfsStorePath: string;
  hiveEndpoint: string;
  inodeId: number;
  mysqlServerEndpoint: string;
  offlineFeaturestoreName: string;
  onlineEnabled: true;
  onlineFeaturestoreName: string;
  onlineFeaturestoreSize: number;
  projectId: number;
  projectName: string;
  numFeatureGroups: number;
  numTrainingDatasets: number;
}

export enum StorageConnectorType {
  redshift = 'REDSHIFT',
  hops = 'HOPSFS',
  jdbc = 'JDBC',
  aws = 'S3',
}

export interface FeatureStoreSource {
  arguments: string;
  connectionString?: string;
  hopsfsPath?: string;
  description: string;
  featurestoreId: number;
  id: number;
  name: string;
  bucket?: string;
  storageConnectorType: StorageConnectorType;
  accessKey?: string;
  secretKey?: string;
}
