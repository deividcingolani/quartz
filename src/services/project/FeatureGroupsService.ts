import BaseApiService, { RequestType } from '../BaseApiService';

// Types
import {
  FeatureGroup,
  FeatureGroupCommitDetail,
  FeatureGroupRowItem,
  Provenance,
} from '../../types/feature-group';
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

  getByName = async (
    projectId: number,
    featureStoreId: number,
    name: string,
    version: number,
  ): Promise<FeatureGroup[]> => {
    const { data } = await this.request<FeatureGroup[]>({
      url: `${projectId}/featurestores/${featureStoreId}/featuregroups/${name}?version=${version}`,
      type: RequestType.get,
    });

    return data;
  };

  getStatistics = (
    projectId: number,
    featureStoreId: number,
    featureGroupId: number,
    timeCommit?: string,
  ) =>
    this.request<GetStatisticsData>({
      url: `${projectId}/featurestores/${featureStoreId}/featuregroups/${featureGroupId}/statistics?${
        timeCommit
          ? `filter_by=commit_time_eq:${timeCommit}`
          : 'sort_by=commit_time:desc&offset=0&limit=1'
      }&fields=content`,
      type: RequestType.get,
    });

  getCommits = (
    projectId: number,
    featureStoreId: number,
    featureGroupId: number,
  ) =>
    this.request<GetStatisticsData>({
      url: `${projectId}/featurestores/${featureStoreId}/featuregroups/${featureGroupId}/statistics`,
      type: RequestType.get,
    });

  getCommitsDetail = (
    projectId: number,
    featureStoreId: number,
    featureGroupId: number,
    limit: number,
  ) =>
    this.request<GetCommitsData>({
      url: `${projectId}/featurestores/${featureStoreId}/featuregroups/${featureGroupId}/commits?offset=0&limit=${limit}&sort_by=committed_on:desc`,
      type: RequestType.get,
    });

  getProvenance = (
    projectId: number,
    featureStoreId: number,
    featureGroup: FeatureGroup,
  ) => {
    const { name, version } = featureGroup;
    return this.request<Provenance>({
      url: `${projectId}/provenance/links?filter_by=IN_ARTIFACT:${name}_${version}&filter_by=IN_TYPE:FEATURE&filter_by=OUT_TYPE:TRAINING_DATASET`,
      type: RequestType.get,
    });
  };

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

  attachTag = (
    projectId: number,
    featureStoreId: number,
    fgId: number,
    name: string,
    data: any,
  ) =>
    this.request<any>({
      type: RequestType.put,
      url: `${projectId}/featurestores/${featureStoreId}/featuregroups/${fgId}/tags/${name}`,
      data,
    });

  getTags = (projectId: number, featureStoreId: number, fgId: number) =>
    this.request<any>({
      type: RequestType.get,
      url: `${projectId}/featurestores/${featureStoreId}/featuregroups/${fgId}/tags?expand=tag_schemas`,
    });

  getOneByName = async (
    projectId: number,
    featureStoreId: number,
    name: string,
  ): Promise<FeatureGroup[]> => {
    const { data } = await this.request<FeatureGroup[]>({
      url: `${projectId}/featurestores/${featureStoreId}/featuregroups/${name}`,
      type: RequestType.get,
    });
    return data;
  };

  deleteTag = (
    projectId: number,
    featureStoreId: number,
    fgId: number,
    name: string,
  ) =>
    this.request<any>({
      type: RequestType.delete,
      url: `${projectId}/featurestores/${featureStoreId}/featuregroups/${fgId}/tags/${name}`,
    });
}

export default new FeatureGroupsService('/project');

export interface GetStatisticsData {
  items?: {
    content: string;
    commitTime: number;
  }[];
}

export interface GetRowsData {
  items?: {
    type: string;
    row: FeatureGroupRowItem[];
  }[];
}

export interface GetCommitsData {
  count: number;
  href: string;
  items: FeatureGroupCommitDetail[];
  type: string;
}
