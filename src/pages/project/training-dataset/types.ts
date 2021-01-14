import { ISource } from '../../../types/source';
import { FeatureGroupBasket } from '../../../store/models/localManagement/basket.model';

export interface TrainingDatasetFormData {
  tags: any;
  name: string;
  storage: ISource;
  dataFormat: string[];
  keywords: string[];
  description: string;
  features: FeatureGroupBasket[];
  statisticConfiguration: string[];
}
