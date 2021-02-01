export enum StorageConnectorType {
  'aws' = 'S3',
  'jdbc' = 'JDBC',
  'hopsfs' = 'HOPSFS',
  'redshift' = 'REDSHIFT',
}

export interface IStorageConnector {
  id: number;
  name: string;
  storageConnectorType: StorageConnectorType;
  featurestoreId: number;
  connectionString?: string;
  hopsfsPath?: string;
}

export interface ICreateAWSStorageConnector {
  name: string;
  bucket: string;
  accessKey?: number;
  secretKey?: string;
  serverEncryptionAlgorithm?: string;
  serverEncryptionKey?: string;
  iamRole?: string;
}

export interface ICreateJDBCStorageConnector {
  name: string;
  connectionString: string;
  arguments?: string;
}

export interface ICreateHOPSFSStorageConnector {
  name: string;
  datasetName: string;
}

export interface ICreateREDSHIFTStorageConnector {
  name: string;
  clusterIdentifier: string;
  databaseDriver: string;
  databaseEndpoint: string;
  databaseName: string;
  databasePort: number;
  tableName: string;
  databaseUserName?: string;
  autoCreate: boolean;
  databasePassword?: string;
  databaseGroup: string;
  iamRole?: string;
  arguments?: string;
}
