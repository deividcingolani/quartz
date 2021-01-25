import { FC, memo } from 'react';
import Yup from 'yup';
import { StorageConnectorType } from '../../../types/feature-store';
import labelValueMap from '../../../utils/labelValueBind';

// Types
import {
  Descriptions,
  DescriptionsData,
  SourceFormProps,
  SourcesFormDataArgument,
} from './forms/types';
import { SourceProtocol } from './types';
// Forms
import AwsForm, { schema as awsSchema } from './forms/AwsForm';
import JdbcForm, { schema as jdbcSchema } from './forms/JdbcForm';
import HopsForm, { schema as hopsSchema } from './forms/HopsForm';
import RedshiftForm, { schema as redshiftSchema } from './forms/RedshiftForm';

export const protocolOptions = labelValueMap<
  { [key in keyof typeof SourceProtocol]: string }
>({
  [SourceProtocol.aws]: 'S3',
  [SourceProtocol.jdbc]: 'JDBC',
  [SourceProtocol.hops]: 'HOPSFS',
  [SourceProtocol.redshift]: 'REDSHIFT',
});

export const protocolVisualOptions = labelValueMap<
  { [key in keyof typeof SourceProtocol]: string }
>({
  [SourceProtocol.aws]: 'AWS S3',
  [SourceProtocol.jdbc]: 'JDBC',
  [SourceProtocol.hops]: 'HopsFS',
  [SourceProtocol.redshift]: 'Redshift',
});

export const getForm = (protocol: SourceProtocol): FC<SourceFormProps> => {
  const sourceForms = {
    [SourceProtocol.jdbc]: JdbcForm,
    [SourceProtocol.aws]: AwsForm,
    [SourceProtocol.hops]: HopsForm,
    [SourceProtocol.redshift]: RedshiftForm,
  };

  return memo(sourceForms[protocol]);
};

export const getSchema = (commonSchema: Yup.ObjectSchema) => (
  protocol: SourceProtocol,
): Yup.ObjectSchema => {
  const sourceSchemas = {
    [SourceProtocol.aws]: awsSchema,
    [SourceProtocol.jdbc]: jdbcSchema,
    [SourceProtocol.hops]: hopsSchema,
    [SourceProtocol.redshift]: redshiftSchema,
  };

  return commonSchema.concat(sourceSchemas[protocol]);
};

export const getConnectorType = (
  protocol: SourceProtocol,
): StorageConnectorType => {
  const protocolsMap = {
    [SourceProtocol.aws]: StorageConnectorType.aws,
    [SourceProtocol.jdbc]: StorageConnectorType.jdbc,
    [SourceProtocol.hops]: StorageConnectorType.hops,
    [SourceProtocol.redshift]: StorageConnectorType.redshift,
  };

  return protocolsMap[protocol];
};

export const getDtoType = (protocol: SourceProtocol): string => {
  const dtosMap = {
    [SourceProtocol.aws]: 'featurestoreS3ConnectorDTO',
    [SourceProtocol.jdbc]: 'featurestoreJdbcConnectorDTO',
    [SourceProtocol.hops]: 'featurestoreHopsfsConnectorDTO',
    [SourceProtocol.redshift]: 'featurestoreRedshiftConnectorDTO',
  };

  return dtosMap[protocol];
};

export const getDescription = (
  descriptions: DescriptionsData,
  protocol: SourceProtocol,
): string => {
  const descMap = {
    [SourceProtocol.aws]: Descriptions.bucket, // AWS
    [SourceProtocol.jdbc]: Descriptions.connectionString, // JDBC
    [SourceProtocol.hops]: Descriptions.datasetName, // HopsFS
    [SourceProtocol.redshift]: Descriptions.clusterIdentifier, // Redshift
  };
  return descriptions[descMap[protocol]];
};

export const formatArguments = (args?: SourcesFormDataArgument[]): string =>
  args?.map(({ key, value }) => `${key}=${value}`).join() || '';

export const formatGroups = (groups?: SourcesFormDataArgument[]): string =>
  groups?.map(({ key }) => `${key}`).join() || '';

export const formatStringToArguments = (
  args: string,
): SourcesFormDataArgument[] =>
  args?.split(',').map((arg) => {
    const splited = arg.split('=');
    return {
      key: splited[0],
      value: splited[1],
    };
  });

export const cropText = (text = '', maxLength: number): string =>
  text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
