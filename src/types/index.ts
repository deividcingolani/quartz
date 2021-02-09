import { Feature, Job } from './feature-group';
import { Split } from './training-dataset';

export interface Tag {
  name: string;
  types: {
    [key: string]: string;
  };
  tags: {
    [key: string]: any;
  };
}

export interface DataEntityVersion {
  id: number;
  version: number;
}

export interface DataEntity {
  type: string;
  created: string;
  updated: string;
  descStatsEnabled: boolean;
  featCorrEnabled: boolean;
  featHistEnabled: boolean;
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
  highlights: any;
  matchText: string;
  statisticsConfig: {
    enabled: boolean;
    histograms: boolean;
    correlations: boolean;
    columns: string[];
  };
  splits: Split[];
  versions: DataEntityVersion[];
}

export interface HoverableCardProps<T> {
  isSelected: boolean;
  data: T;
  handleToggle: () => void;
  hasMatchText?: boolean;
  loading?: boolean;
}
