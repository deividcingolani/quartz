import BaseApiService, { RequestType } from '../BaseApiService';

// Types
import { FeatureGroup } from '../../types/feature-group';

class FeatureGroupsService extends BaseApiService {
  getList = async (
    projectId: number,
    featureStoreId: number,
  ): Promise<FeatureGroup[]> => {
    const { data } = await this.request<FeatureGroup[]>({
      url: `${projectId}/featurestores/${featureStoreId}/featuregroups`,
      type: RequestType.get,
    });

    return data;
  };
}

export default new FeatureGroupsService('project');
