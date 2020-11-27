import BaseApiService, { RequestType } from '../BaseApiService';

// Types
import { FeatureGroup, FeatureGroupRowItem } from '../../types/feature-group';
import { StorageConnectorType } from '../../types/feature-group-data-preview';

const getQueryParams = (onlineEnabled: boolean) => {
  // [param name, is need to include in the query]
  const paramsMap = [
    ['updateMetadata=true', true],
    ['enableOnline=true', onlineEnabled],
    ['disableOnline=true', !onlineEnabled],
    ['updateStatsSettings=true', true],
  ];

  return paramsMap.reduce(
    (acc, [param, isInclude]) => (isInclude ? `${acc}&${param}` : acc),
    '',
  );
};

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

  create = (projectId: number, featureStoreId: number, data: any) =>
    this.request<any>({
      type: RequestType.post,
      url: `${projectId}/featurestores/${featureStoreId}/featuregroups?${getQueryParams(
        data.onlineEnabled,
      )}`,
      data,
    });

  edit = (
    projectId: number,
    featureStoreId: number,
    featureGroupId: number,
    data: any,
  ) =>
    this.request<any>({
      type: RequestType.put,
      url: `${projectId}/featurestores/${featureStoreId}/featuregroups/${featureGroupId}?${getQueryParams(
        data.onlineEnabled,
      )}`,
      data,
    });

  delete = (
    projectId: number,
    featureStoreId: number,
    featureGroupId: number,
  ) =>
    this.request<any>({
      type: RequestType.delete,
      url: `${projectId}/featurestores/${featureStoreId}/featuregroups/${featureGroupId}`,
    });

  attachLabel = (
    projectId: number,
    featureStoreId: number,
    fgId: number,
    label: string,
  ) =>
    this.request<any>({
      type: RequestType.put,
      url: `${projectId}/featurestores/${featureStoreId}/featuregroups/${fgId}/tags/${label}?value=`,
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
