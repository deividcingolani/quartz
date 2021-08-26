import {
  FeatureGroup,
  SchematisedTagEntity,
} from '../../../types/feature-group';
import { ItemDrawerTypes } from '../../../components/drawer/ItemDrawer';

export enum TimeTravelType {
  'hudi' = 'Hudi',
  'none' = 'None',
}

export enum ValidationType {
  'strict' = 'Strict',
  'warning' = 'Warning',
  'all' = 'All',
  'none' = 'None',
}

export interface FeatureGroupFormData {
  name: string;
  description: string;
  onlineEnabled: boolean;
  features: any[];
  keywords: string[];
  timeTravelFormat: string[];
  tags: any;
  correlations: boolean;
  enabled: boolean;
  histograms: boolean;
  validationType: string[];
}

export interface FeatureFormProps {
  isDisabled: boolean;
  isEdit?: boolean;
  type?: ItemDrawerTypes;
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
  itemType?: string;
  tag: SchematisedTagEntity;
  name: string;
  description?: string;
  isDisabled: boolean;
  isFirstItem?: boolean;
  isInputOnly?: boolean;
}
