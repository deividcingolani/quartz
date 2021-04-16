export enum StorageConnectorType {
  redshift = 'REDSHIFT',
  hops = 'HOPSFS',
  jdbc = 'JDBC',
  aws = 'S3',
  azure = 'ADLS',
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

export interface ICreateADLSSource {
  generation: number;
  directoryId: string;
  applicationId: string;
  serviceCredential: string;
  accountName: string;
  containerName?: string;
}

export interface Options {
  name: string;
  value: string;
}

export interface ICreateSnowflakeConnector {
  name: string;
  url: string;
  user: string;
  password?: string;
  token?: string;
  database: string;
  schema: string;
  warehouse?: string;
  role?: string;
  table?: string;
  sfOptions?: Options[];
}
