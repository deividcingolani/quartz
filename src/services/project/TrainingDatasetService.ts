import BaseApiService, { RequestType } from '../BaseApiService';
import { ITrainingDataset } from '../../types/training-dataset';

class TrainingDatasetService extends BaseApiService {
  getList = async (
    projectId: number,
    featureStoreId: number,
  ): Promise<ITrainingDataset[]> => {
    const { data } = await this.request<ITrainingDataset[]>({
      url: `${projectId}/featurestores/${featureStoreId}/trainingdatasets`,
      type: RequestType.get,
    });

    return data;
  };

  getOneByName = async (
    projectId: number,
    featureStoreId: number,
    name: string,
  ): Promise<ITrainingDataset[]> => {
    const { data } = await this.request<ITrainingDataset[]>({
      url: `${projectId}/featurestores/${featureStoreId}/trainingdatasets/${name}`,
      type: RequestType.get,
    });

    return data;
  };
}

export default new TrainingDatasetService('/project');
