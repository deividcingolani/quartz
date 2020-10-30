export interface Feature {
  defaultValue: string | number;
  description?: string;
  name: string;
  partition: boolean;
  primary: boolean;
  type: string;
}

export interface Job {
  jobId: number;
  jobName: string;
  lastComputed: string;
  jobStatus: 'Succeeded' | 'Failed' | 'Running';
  featurestoreId: number;
  featuregroupId: number;
}

export interface FeatureGroup {
  created: string;
  creator: string;
  defaultStorage: string;
  descStatsEnabled: boolean;
  description: string;
  featCorrEnabled: boolean;
  featHistEnabled: boolean;
  features: Feature[];
  featurestoreId: number;
  featurestoreName: string;
  hudiEnabled: boolean;
  id: number;
  jobs: Job[]; // Todo: Update
  location: string;
  name: string;
  onlineEnabled: boolean;
  statisticColumns: any;
  type: string;
  version: number;
  labels?: string[];
}

export interface FeatureGroupLabel {
  href: string;
  name: string;
  value?: string;
}
