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
}

export interface SourcesFormDataArgument {
  key: string;
  value: string;
}

export interface SourcesFormData {
  name: string;
  connectionString: string;
  protocol: SourceProtocol;
  arguments?: SourcesFormDataArgument[];
  // AWS
  accessKey?: string;
  secretKey?: string;
  bucket?: string;
  // JDBC
  key?: string;
  value?: string;
}
