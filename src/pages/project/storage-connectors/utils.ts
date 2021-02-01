import { FC, memo } from 'react';
import Yup from 'yup';
import { StorageConnectorType } from '../../../types/feature-store';
import labelValueMap from '../../../utils/labelValueBind';

// Types
import {
  Descriptions,
  DescriptionsData,
  StorageConnectorFormProps,
  StorageConnectorsFormDataArgument,
} from './forms/types';
import { StorageConnectorProtocol } from './types';
// Forms
import AwsForm, { schema as awsSchema } from './forms/AwsForm';
import JdbcForm, { schema as jdbcSchema } from './forms/JdbcForm';
import HopsForm, { schema as hopsSchema } from './forms/HopsForm';
import RedshiftForm, { schema as redshiftSchema } from './forms/RedshiftForm';

export const protocolOptions = labelValueMap<
  { [key in keyof typeof StorageConnectorProtocol]: string }
>({
  [StorageConnectorProtocol.aws]: 'S3',
  [StorageConnectorProtocol.jdbc]: 'JDBC',
  [StorageConnectorProtocol.hops]: 'HOPSFS',
  [StorageConnectorProtocol.redshift]: 'REDSHIFT',
});

export const protocolVisualOptions = labelValueMap<
  { [key in keyof typeof StorageConnectorProtocol]: string }
>({
  [StorageConnectorProtocol.aws]: 'AWS S3',
  [StorageConnectorProtocol.jdbc]: 'JDBC',
  [StorageConnectorProtocol.hops]: 'HopsFS',
  [StorageConnectorProtocol.redshift]: 'Redshift',
});

export const getForm = (
  protocol: StorageConnectorProtocol,
): FC<StorageConnectorFormProps> => {
  const storageConnectorForms = {
    [StorageConnectorProtocol.jdbc]: JdbcForm,
    [StorageConnectorProtocol.aws]: AwsForm,
    [StorageConnectorProtocol.hops]: HopsForm,
    [StorageConnectorProtocol.redshift]: RedshiftForm,
  };

  return memo(storageConnectorForms[protocol]);
};

export const getSchema = (commonSchema: Yup.ObjectSchema) => (
  protocol: StorageConnectorProtocol,
): Yup.ObjectSchema => {
  const storageConnectorSchemas = {
    [StorageConnectorProtocol.aws]: awsSchema,
    [StorageConnectorProtocol.jdbc]: jdbcSchema,
    [StorageConnectorProtocol.hops]: hopsSchema,
    [StorageConnectorProtocol.redshift]: redshiftSchema,
  };

  return commonSchema.concat(storageConnectorSchemas[protocol]);
};

export const getConnectorType = (
  protocol: StorageConnectorProtocol,
): StorageConnectorType => {
  const protocolsMap = {
    [StorageConnectorProtocol.aws]: StorageConnectorType.aws,
    [StorageConnectorProtocol.jdbc]: StorageConnectorType.jdbc,
    [StorageConnectorProtocol.hops]: StorageConnectorType.hops,
    [StorageConnectorProtocol.redshift]: StorageConnectorType.redshift,
  };

  return protocolsMap[protocol];
};

export const getDtoType = (protocol: StorageConnectorProtocol): string => {
  const dtosMap = {
    [StorageConnectorProtocol.aws]: 'featurestoreS3ConnectorDTO',
    [StorageConnectorProtocol.jdbc]: 'featurestoreJdbcConnectorDTO',
    [StorageConnectorProtocol.hops]: 'featurestoreHopsfsConnectorDTO',
    [StorageConnectorProtocol.redshift]: 'featurestoreRedshiftConnectorDTO',
  };

  return dtosMap[protocol];
};

export const getDescription = (
  descriptions: DescriptionsData,
  protocol: StorageConnectorProtocol,
): string => {
  const descMap = {
    [StorageConnectorProtocol.aws]: Descriptions.bucket, // AWS
    [StorageConnectorProtocol.jdbc]: Descriptions.connectionString, // JDBC
    [StorageConnectorProtocol.hops]: Descriptions.datasetName, // HopsFS
    [StorageConnectorProtocol.redshift]: Descriptions.clusterIdentifier, // Redshift
  };
  return descriptions[descMap[protocol]];
};

export const formatArguments = (
  args?: StorageConnectorsFormDataArgument[],
): string => args?.map(({ key, value }) => `${key}=${value}`).join() || '';

export const formatGroups = (
  groups?: StorageConnectorsFormDataArgument[],
): string => groups?.map(({ key }) => `${key}`).join() || '';

export const formatStringToArguments = (
  args: string,
): StorageConnectorsFormDataArgument[] =>
  args?.split(',').map((arg) => {
    const splited = arg.split('=');
    return {
      key: splited[0],
      value: splited[1],
    };
  });

export const cropText = (text = '', maxLength: number): string =>
  text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
