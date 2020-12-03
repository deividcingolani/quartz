import { Feature, Job } from './feature-group';

export interface DataEntity {
  type: string;
  created: string;
  onlineEnabled: boolean;
  creator: string;
  description: string;
  features: Feature[];
  labels: any[];
  featurestoreId: number;
  featurestoreName: string;
  id: number;
  jobs: Job[];
  location: string;
  name: string;
  version: number;
}

export interface HoverableCardProps<T> {
  isSelected: boolean;
  data: T;
  isLabelsLoading: boolean;
  handleToggle: () => void;
}
