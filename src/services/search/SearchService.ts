import BaseApiService, { RequestType } from '../BaseApiService';
import { TrainingDataset } from '../../types/training-dataset';
import SearchTypes from '../../pages/search/types';
import { FeatureGroup } from '../../types/feature-group';
import { Feature } from '../../types/feature';

class SearchService extends BaseApiService {
  getAll = async (searchTerm: string): Promise<ServerResponseData> => {
    const { data } = await this.request<ServerResponseData>({
      url: `elastic/featurestore/${searchTerm}?docType=ALL&from=0&size=100`,
      type: RequestType.get,
    });

    return data;
  };

  getType = async (
    searchTerm: string,
    type: SearchTypes,
  ): Promise<ServerResponseData> => {
    const { data } = await this.request<ServerResponseData>({
      url: `elastic/featurestore/${searchTerm}?docType=${type}&from=0&size=100`,
      type: RequestType.get,
    });

    return data;
  };

  getAllFromProject = async (
    projectId: number,
    searchTerm: string,
  ): Promise<ServerResponseData> => {
    const { data } = await this.request<ServerResponseData>({
      url: `project/${projectId}/elastic/featurestore/${searchTerm}?docType=ALL&from=0&size=100`,
      type: RequestType.get,
    });

    return data;
  };

  getTypeFromProject = async (
    projectId: number,
    searchTerm: string,
    type: SearchTypes,
  ): Promise<ServerResponseData> => {
    const { data } = await this.request<ServerResponseData>({
      url: `project/${projectId}/elastic/featurestore/${searchTerm}?docType=${type}&from=0&size=100`,
      type: RequestType.get,
    });

    return data;
  };
}

export interface ServerResponseData {
  featuregroups: FeatureGroup[];
  features: Feature[];
  trainingdatasets: TrainingDataset[];
}

export default new SearchService('');
