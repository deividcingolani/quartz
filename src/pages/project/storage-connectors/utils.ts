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
import StorageConnectorProtocol from './types';
// Forms
import AwsForm, { schema as awsSchema } from './forms/AwsForm';
import JdbcForm, { schema as jdbcSchema } from './forms/JdbcForm';
import HopsForm, { schema as hopsSchema } from './forms/HopsForm';
import RedshiftForm, { schema as redshiftSchema } from './forms/RedshiftForm';
import AzureForm, { schema as azureSchema } from './forms/AzureForm';
import SnowflakeForm, {
  schema as snowflakeSchema,
} from './forms/SnowflakeForm';

export const protocolOptions = labelValueMap<
  { [key in keyof typeof StorageConnectorProtocol]: string }
>({
  [StorageConnectorProtocol.aws]: 'S3',
  [StorageConnectorProtocol.jdbc]: 'JDBC',
  [StorageConnectorProtocol.hops]: 'HOPSFS',
  [StorageConnectorProtocol.redshift]: 'REDSHIFT',
  [StorageConnectorProtocol.azure]: 'ADLS',
  [StorageConnectorProtocol.snowflake]: 'SNOWFLAKE',
});

export const protocolVisualOptions = labelValueMap<
  { [key in keyof typeof StorageConnectorProtocol]: string }
>({
  [StorageConnectorProtocol.aws]: 'AWS S3',
  [StorageConnectorProtocol.jdbc]: 'JDBC',
  [StorageConnectorProtocol.hops]: 'HopsFS',
  [StorageConnectorProtocol.redshift]: 'Redshift',
  [StorageConnectorProtocol.azure]: 'Azure Data Lake',
  [StorageConnectorProtocol.snowflake]: 'Snowflake',
});

export const getForm = (
  protocol: StorageConnectorProtocol,
): FC<StorageConnectorFormProps> => {
  const storageConnectorForms = {
    [StorageConnectorProtocol.jdbc]: JdbcForm,
    [StorageConnectorProtocol.aws]: AwsForm,
    [StorageConnectorProtocol.hops]: HopsForm,
    [StorageConnectorProtocol.redshift]: RedshiftForm,
    [StorageConnectorProtocol.azure]: AzureForm,
    [StorageConnectorProtocol.snowflake]: SnowflakeForm,
  };

  return memo(storageConnectorForms[protocol]);
};

export const getSchema =
  (commonSchema: Yup.ObjectSchema) =>
  (protocol: StorageConnectorProtocol): Yup.ObjectSchema => {
    const storageConnectorSchemas = {
      [StorageConnectorProtocol.aws]: awsSchema,
      [StorageConnectorProtocol.jdbc]: jdbcSchema,
      [StorageConnectorProtocol.hops]: hopsSchema,
      [StorageConnectorProtocol.redshift]: redshiftSchema,
      [StorageConnectorProtocol.azure]: azureSchema,
      [StorageConnectorProtocol.snowflake]: snowflakeSchema,
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
    [StorageConnectorProtocol.azure]: StorageConnectorType.azure,
    [StorageConnectorProtocol.snowflake]: StorageConnectorType.azure,
  };

  return protocolsMap[protocol];
};

export const getDtoType = (protocol: StorageConnectorProtocol): string => {
  const dtosMap = {
    [StorageConnectorProtocol.aws]: 'featurestoreS3ConnectorDTO',
    [StorageConnectorProtocol.jdbc]: 'featurestoreJdbcConnectorDTO',
    [StorageConnectorProtocol.hops]: 'featurestoreHopsfsConnectorDTO',
    [StorageConnectorProtocol.redshift]: 'featurestoreRedshiftConnectorDTO',
    [StorageConnectorProtocol.azure]: 'featurestoreADLSConnectorDTO',
    [StorageConnectorProtocol.snowflake]: 'featurestoreSnowflakeConnectorDTO',
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
    [StorageConnectorProtocol.azure]: Descriptions.directoryId, // Azure
    [StorageConnectorProtocol.snowflake]: Descriptions.connectionURL, // Snowflake
  };
  return descriptions[descMap[protocol]];
};

export const formatArguments = (
  args?: StorageConnectorsFormDataArgument[],
): string =>
  args
    ?.map(({ key, value }) => {
      if (key && value) return `${key}=${value}`;
      return key;
    })
    .join() || '';

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
