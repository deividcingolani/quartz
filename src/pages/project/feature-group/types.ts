import {
  FeatureGroup,
  SchematisedTagEntity,
} from '../../../types/feature-group';

export enum TimeTravelType {
  'hudi' = 'Hudi',
  'none' = 'None',
}

export interface FeatureGroupFormData {
  name: string;
  description: string;
  onlineEnabled: boolean;
  features: any[];
  keywords: string[];
  timeTravelFormat: string[];
  statisticConfiguration: string[];
  tags: any;
}

export interface FeatureFormProps {
  isDisabled: boolean;
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

export interface TypeFormProps {
  type?: string;
  tag: SchematisedTagEntity;
  name: string;
  isDisabled: boolean;
}
