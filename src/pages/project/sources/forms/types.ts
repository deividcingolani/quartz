import { ReactElement } from 'react';
// eslint-disable-next-line import/no-unresolved
import { FieldErrors } from 'react-hook-form/dist/types/errors';
// eslint-disable-next-line import/no-unresolved
import { Ref } from 'react-hook-form/dist/types/fields';
import { SourceProtocol } from '../types';

export interface SourceFormProps {
  register: (ref: (ReactElement & Ref) | null) => void;
  isDisabled: boolean;
  errors: FieldErrors<SourcesFormData>;
  control: any;
  watch: any;
  setValue: any;
}

export interface SourcesFormDataArgument {
  key: string;
  value: string;
}

export interface SourcesFormData {
  name: string;
  description: string;
  protocol: SourceProtocol;
  arguments?: SourcesFormDataArgument[];
  iamRole?: string;
  // AWS
  accessKey?: string;
  secretKey?: string;
  bucket: string;
  serverEncryptionAlgorithm?: string;
  serverEncryptionKey?: string;
  // JDBC
  connectionString: string;
  // HOPS
  datasetName: string;
  // Redshift
  clusterIdentifier: string;
  databaseDriver?: string;
  databaseEndpoint?: string;
  databaseName?: string;
  databasePort?: number;
  tableName?: string;
  databaseUserName?: string;
  autoCreate?: boolean;
  databaseGroup?: string;
  databasePassword?: string;
}

export enum Descriptions {
  bucket = 'bucket', // AWS
  connectionString = 'connectionString', // JDBC
  datasetName = 'datasetName', // HopsFS
  clusterIdentifier = 'clusterIdentifier', // Redshift
}

export interface DescriptionsData {
  [Descriptions.bucket]: string; // AWS
  [Descriptions.connectionString]: string; // JDBC
  [Descriptions.datasetName]: string; // HopsFS
  [Descriptions.clusterIdentifier]: string; // Redshift
}
