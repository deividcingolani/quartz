import BaseApiService, { RequestType } from '../BaseApiService';

// Types
import { FeatureStore } from '../../types/feature-store';

class FeatureStoresService extends BaseApiService {
  getList = async (projectId: number): Promise<FeatureStore[]> => {
    const { data } = await this.request<FeatureStore[]>({
      url: `${projectId}/featurestores`,
      type: RequestType.get,
    });

    return data;
  };
}

export default new FeatureStoresService('project');
