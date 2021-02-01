import { IStorageConnector } from '../../../types/storage-connector';
import { FeatureGroupBasket } from '../../../store/models/localManagement/basket.model';

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
}
