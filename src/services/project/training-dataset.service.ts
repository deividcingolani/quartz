import { AxiosPromise } from 'axios';
import BaseApiService, { RequestType } from '../BaseApiService';
import { ITrainingDataset } from '../../types/training-dataset';

export class TrainingDatasetService extends BaseApiService {
  protected baseUrl = 'project';

  public getList = (
    projectId: number,
    featureStoreId: number,
  ): AxiosPromise<ITrainingDataset[]> => {
    return this.request<ITrainingDataset[]>({
      url: `${projectId}/featurestores/${featureStoreId}/trainingdatasets`,
      type: RequestType.get,
    });
  };
}
