export enum StorageConnectorType {
  'aws' = 'S3',
  'jdbc' = 'JDBC',
}

export interface ISource {
  id: number;
  name: string;
  storageConnectorType: StorageConnectorType;
  featurestoreId: number;
  connectionString?: string;
  hopsfsPath?: string;
}

export interface ICreateAWSSource {
  name: string;
  bucket: string;
  accessKey?: number;
  secretKey?: string;
  serverEncryptionAlgorithm?: string;
  serverEncryptionKey?: string;
  iamRole?: string;
}

export interface ICreateJDBCSource {
  name: string;
  connectionString: string;
  arguments?: string;
}

export interface ICreateHOPSFSSource {
  name: string;
  datasetName: string;
}

export interface ICreateREDSHIFTSource {
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
