import BaseApiService, { RequestType } from '../BaseApiService';

// Types
import { FeatureGroup, FeatureGroupRowItem } from '../../types/feature-group';
import { StorageConnectorType } from '../../types/feature-group-data-preview';

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

  get = async (
    projectId: number,
    featureStoreId: number,
    featureGroupId: number,
  ): Promise<FeatureGroup> => {
    const { data } = await this.request<FeatureGroup>({
      url: `${projectId}/featurestores/${featureStoreId}/featuregroups/${featureGroupId}`,
      type: RequestType.get,
    });

    return data;
  };

  getStatistics = (
    projectId: number,
    featureStoreId: number,
    featureGroupId: number,
  ) =>
    this.request<GetStatisticsData>({
      url: `${projectId}/featurestores/${featureStoreId}/featuregroups/${featureGroupId}/statistics?sort_by=commit_time:desc&fields=content`,
      type: RequestType.get,
    });

  getRows = (
    projectId: number,
    featureStoreId: number,
    featureGroupId: number,
    limit = 100,
    storage = StorageConnectorType.offline,
  ) =>
    this.request<GetRowsData>({
      url: `${projectId}/featurestores/${featureStoreId}/featuregroups/${featureGroupId}/preview?storage=${storage}&limit=${limit}`,
      type: RequestType.get,
    });
}

export default new FeatureGroupsService('project');

export interface GetStatisticsData {
  items?: {
    content: string;
  }[];
}

export interface GetRowsData {
  items?: {
    type: string;
    row: FeatureGroupRowItem[];
  }[];
}
