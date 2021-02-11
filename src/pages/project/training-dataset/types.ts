import { IStorageConnector } from '../../../types/storage-connector';
import { FeatureGroupBasket } from '../../../store/models/localManagement/basket.model';

export interface TdSplit {
  name: string;
  percentage: string;
}

export interface TrainingDatasetFormData {
  tags: any;
  name: string;
  storage: IStorageConnector;
  dataFormat: string[];
  keywords: string[];
  description: string;
  features: FeatureGroupBasket[];
  correlations: boolean;
  enabled: boolean;
  histograms: boolean;
  statisticsColumns: string[];
  splits: TdSplit[];
}
