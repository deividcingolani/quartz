import BaseApiService, { RequestType } from '../BaseApiService';
import {
  TrainingDataset,
  TrainingDatasetQuery,
} from '../../types/training-dataset';

class TrainingDatasetService extends BaseApiService {
  getList = async (
    projectId: number,
    featureStoreId: number,
  ): Promise<TrainingDataset[]> => {
    const { data } = await this.request<TrainingDataset[]>({
      url: `${projectId}/featurestores/${featureStoreId}/trainingdatasets`,
      type: RequestType.get,
    });

    return data;
  };

  getOneByName = async (
    projectId: number,
    featureStoreId: number,
    name: string,
  ): Promise<TrainingDataset[]> => {
    const { data } = await this.request<TrainingDataset[]>({
      url: `${projectId}/featurestores/${featureStoreId}/trainingdatasets/${name}`,
      type: RequestType.get,
    });
    return data;
  };

  get = async (
    projectId: number,
    featureStoreId: number,
    trainingDatasetId: number,
  ): Promise<TrainingDataset> => {
    const { data } = await this.request<TrainingDataset>({
      url: `${projectId}/featurestores/${featureStoreId}/trainingdatasets/${trainingDatasetId}`,
      type: RequestType.get,
    });

    return data;
  };

  getQuery = async (
    projectId: number,
    featureStoreId: number,
    trainingDatasetId: number,
  ): Promise<TrainingDatasetQuery> => {
    const { data } = await this.request<TrainingDatasetQuery>({
      url: `${projectId}/featurestores/${featureStoreId}/trainingdatasets/${trainingDatasetId}/query`,
      type: RequestType.get,
    });

    return data;
  };
}

export default new TrainingDatasetService('/project');
