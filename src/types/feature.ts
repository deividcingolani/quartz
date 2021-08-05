/* eslint-disable import/no-cycle */
import { FeatureGroup } from './feature-group';

export interface Feature {
  defaultValue: string | number;
  description?: string;
  name: string;
  id: number;
  features: Feature[];
  primary: boolean;
  partition: boolean;
  type: string;
  onlineType?: string;
  label: boolean;
  index: number;
  featuregroup: FeatureGroup;
  version: number;
  created?: string;
  parentProjectName: string;
  parentProjectId: number;
  featurestoreId: number;
  matchText: string;
  highlights: any;
  featureId: number;
}
