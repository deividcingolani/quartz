import { SchematisedTagEntity } from '../../../../types/feature-group';
import { FGRow } from '@logicalclocks/quartz/dist/components/table/type';

export interface SchematisedTagFormData {
  name: string;
  description: string;
  properties: FGRow[];
}

export interface SchematisedTagFormProps {
  isDisabled: boolean;
  onSubmit: (data: SchematisedTagFormData) => void;
  isEdit?: boolean;
  initialData?: SchematisedTagEntity;
  error?: string;
}
