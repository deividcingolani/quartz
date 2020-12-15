import { Feature, Job } from './feature-group';

export interface Tag {
  name: string;
  types: {
    [key: string]: string;
  };
  tags: {
    [key: string]: any;
  };
}

export interface DataEntity {
  type: string;
  created: string;
  onlineEnabled: boolean;
  creator: string;
  description: string;
  features: Feature[];
  labels: string[];
  featurestoreId: number;
  featurestoreName: string;
  id: number;
  jobs: Job[];
  location: string;
  name: string;
  version: number;
  tags: Tag[];
}

export interface HoverableCardProps<T> {
  isSelected: boolean;
  data: T;
  handleToggle: () => void;
}
