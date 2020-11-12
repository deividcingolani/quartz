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
  accessKey: number;
  secretKey?: string;
}

export interface ICreateJDBCSource {
  name: string;
  connectionString: string;
  arguments?: string;
}
