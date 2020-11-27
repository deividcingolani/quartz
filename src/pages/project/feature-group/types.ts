import { ReactElement } from 'react';
// eslint-disable-next-line import/no-unresolved
import { Ref } from 'react-hook-form/dist/types/fields';
// eslint-disable-next-line import/no-unresolved
import { FieldErrors } from 'react-hook-form/dist/types/errors';
import { FeatureGroup } from '../../../types/feature-group';

export enum TimeTravelType {
  'hudi' = 'Hudi',
  'none' = 'None',
}

export interface FeatureGroupFormData {
  name: string;
  description: string;
  onlineEnabled: boolean;
  features: any[];
  labels: string[];
  timeTravelFormat: string[];
  statisticConfiguration: string[];
}

export interface FeatureFormProps {
  register?: (ref: (ReactElement & Ref) | null) => void;
  isDisabled: boolean;
  errors?: FieldErrors<FeatureGroupFormData>;
  control?: any;
  watch?: any;
  setValue?: any;
  getValues?: any;
  isEdit?: boolean;
}

export interface FeatureGroupFormProps {
  isLoading: boolean;
  isDisabled: boolean;
  submitHandler: (data: FeatureGroupFormData) => void;
  onDelete?: () => void;
  isEdit?: boolean;
  initialData?: FeatureGroup;
}
