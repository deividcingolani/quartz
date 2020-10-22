export interface Feature {
  name: string;
  partition: boolean;
  primary: boolean;
  type: string; // Todo: Change to Enum
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
  jobs: any; // Todo: Update
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
