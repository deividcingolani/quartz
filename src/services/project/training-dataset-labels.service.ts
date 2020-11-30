import { AxiosPromise } from 'axios';
import BaseApiService, { RequestType } from '../BaseApiService';
import { ITrainingDatasetLabel } from '../../types/training-dataset-label';

export interface IRTrainingDatasetLabels {
  count: number;
  href: string;
  items: ITrainingDatasetLabel[];
  type: string;
}

export class TrainingDatasetLabelService extends BaseApiService {
  protected baseUrl = '/project';

  public getList = (
    projectId: number,
    featureStoreId: number,
    trainingDatasetId: number,
  ): AxiosPromise<IRTrainingDatasetLabels> => {
    return this.request<IRTrainingDatasetLabels>({
      url: `${projectId}/featurestores/${featureStoreId}/trainingdatasets/${trainingDatasetId}/tags`,
      type: RequestType.get,
    });
  };
}
