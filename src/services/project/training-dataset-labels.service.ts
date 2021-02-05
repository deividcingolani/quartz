import { AxiosPromise } from 'axios';
import BaseApiService, { RequestType } from '../BaseApiService';
import { TrainingDatasetLabel } from '../../types/training-dataset-label';

export interface IRTrainingDatasetLabels {
  count: number;
  href: string;
  items: TrainingDatasetLabel[];
  type: string;
}

export class TrainingDatasetLabelService extends BaseApiService {
  protected baseUrl = '/project';

  getList = async (
    projectId: number,
    featureStoreId: number,
    trainingDatasetId: number,
  ): Promise<string[]> => {
    const { data } = await this.request<any>({
      url: `${projectId}/featurestores/${featureStoreId}/trainingdatasets/${trainingDatasetId}/keywords`,
      type: RequestType.get,
    });

    return data.keywords || [];
  };

  public getKeywords = (
    projectId: number,
    featureStoreId: number,
    trainingDatasetId: number,
  ): AxiosPromise<any> => {
    return this.request<any>({
      url: `${projectId}/featurestores/${featureStoreId}/trainingdatasets/${trainingDatasetId}/keywords`,
      type: RequestType.get,
    });
  };
}
