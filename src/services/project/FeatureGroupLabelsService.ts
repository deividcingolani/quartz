import { FeatureGroupLabel } from '../../types/feature-group';
import BaseApiService, { RequestType } from '../BaseApiService';

class FeatureGroupLabelsService extends BaseApiService {
  getList = async (
    projectId: number,
    featureStoreId: number,
    featureGroupId: number,
  ): Promise<FeatureGroupLabel[] | undefined> => {
    const { data } = await this.request<any>({
      url: `${projectId}/featurestores/${featureStoreId}/featuregroups/${featureGroupId}/tags`,
      type: RequestType.get,
    });

    return data?.items;
  };
}

export default new FeatureGroupLabelsService('/project');
