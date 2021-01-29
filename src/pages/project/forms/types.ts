import { ReactElement } from 'react';
// eslint-disable-next-line import/no-unresolved
import { FieldErrors } from 'react-hook-form/dist/types/errors';
// eslint-disable-next-line import/no-unresolved
import { Ref } from 'react-hook-form/dist/types/fields';

export interface SourceFormProps {
  register: (ref: (ReactElement & Ref) | null) => void;
  isDisabled: boolean;
  errors: FieldErrors<ProjectFormData>;
  control: any;
}

export interface ProjectFormData {
  projectName: string;
  description: string;
  membersEmails: string[];
}
