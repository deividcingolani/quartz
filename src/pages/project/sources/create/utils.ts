import { FC, memo } from 'react';
import Yup from 'yup';
import { StorageConnectorType } from '../../../../types/feature-store';
import labelValueMap from '../../../../utils/labelValueBind';

// Types
import { SourceProtocol } from './types';
// Forms
import AwsForm, { schema as awsSchema } from './../forms/AwsForm';
import JdbcForm, { schema as jdbcSchema } from './../forms/JdbcForm';
import { SourceFormProps, SourcesFormDataArgument } from '../forms/types';

export const protocolOptions = labelValueMap<
  { [key in keyof typeof SourceProtocol]: string }
>({
  [SourceProtocol.aws]: 'AWS S3',
  [SourceProtocol.jdbc]: 'JDBC',
});

export const getForm = (protocol: SourceProtocol): FC<SourceFormProps> => {
  const sourceForms = {
    [SourceProtocol.jdbc]: JdbcForm,
    [SourceProtocol.aws]: AwsForm,
  };

  return memo(sourceForms[protocol]);
};

export const getSchema = (protocol: SourceProtocol): Yup.ObjectSchema => {
  const sourceSchemas = {
    [SourceProtocol.aws]: awsSchema,
    [SourceProtocol.jdbc]: jdbcSchema,
  };

  return sourceSchemas[protocol];
};

export const getConnectorType = (
  protocol: SourceProtocol,
): StorageConnectorType => {
  const protocolsMap = {
    [SourceProtocol.aws]: StorageConnectorType.aws,
    [SourceProtocol.jdbc]: StorageConnectorType.jdbc,
  };

  return protocolsMap[protocol];
};

export const getDtoType = (protocol: SourceProtocol): string => {
  const dtosMap = {
    [SourceProtocol.aws]: 'featurestoreS3ConnectorDTO',
    [SourceProtocol.jdbc]: 'featurestoreJdbcConnectorDTO',
  };

  return dtosMap[protocol];
};

export const formatArguments = (args?: SourcesFormDataArgument[]): string =>
  args?.map(({ key, value }) => `${key}=${value}`).join() || '';
