import { IStorageConnector } from '../../../types/storage-connector';
import { FeatureGroup } from '../../../types/feature-group';
import { FeatureGroupBasket } from '../../../store/models/localManagement/basket.model';

export interface TdSplit {
  name: string;
  percentage: string;
}

export interface FeatureGroupFilter {
  id: string;
  value?: string;
  fg?: FeatureGroup;
  operation: string[];
  features?: string[];
}

export interface FeatureGroupJoin {
  id: string;
  firstFg?: FeatureGroup;
  secondFg?: FeatureGroup;
  firstFgJoinKeys: string[][];
  secondFgJoinKeys: string[][];
}

export interface TrainingDatasetFormData {
  tags: any;
  name: string;
  enabled: boolean;
  splits: TdSplit[];
  keywords: string[];
  description: string;
  histograms: boolean;
  dataFormat: string[];
  correlations: boolean;
  joins: FeatureGroupJoin[];
  storage: IStorageConnector;
  statisticsColumns: string[];
  features: FeatureGroupBasket[];
  rowFilters: FeatureGroupFilter[];
}
