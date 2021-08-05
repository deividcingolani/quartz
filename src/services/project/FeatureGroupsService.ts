import BaseApiService, { RequestType } from '../BaseApiService';

// Types
import {
  ActivityItemData,
  FeatureGroup,
  FeatureGroupCommitDetail,
  FeatureGroupRowItem,
} from '../../types/feature-group';
import { StorageConnectorType } from '../../types/feature-group-data-preview';
import { ActivityTypeSortOptions } from '../../pages/project/feature-group/activity/types';

export const getQueryParams = (
  onlineEnabled: boolean,
  validationType?: string,
) => {
  // [param name, is need to include in the query]
  const paramsMap = [
    ['updateMetadata=true', true],
    ['updateStatsConfig=true', true],
    ['enableOnline=true', onlineEnabled],
    ['disableOnline=true', !onlineEnabled],
    ['updateStatsSettings=true', true],
    [`validationType=${validationType}`, validationType],
  ];
  return paramsMap.reduce(
    (acc, [param, isInclude]) => (isInclude ? `${acc}&${param}` : acc),
    '',
  );
};

export const getExpandParam = (): string => {
  return `expand=commits&expand=jobs&expand=users&expand=statistics&expand=executions&expand=validations`;
};

export const getTimeParam = (timeProps?: {
  from?: number;
  to?: number;
}): string => {
  if (!timeProps) {
    return '';
  }

  const { from, to } = timeProps;

  return `${from ? `filter_by=timestamp_gt:${from}` : ''}&${
    to ? `filter_by=timestamp_lt:${to}` : ''
  }`;
};

export const getOffsetParam = (offsetProps?: {
  offset: number;
  limit?: number;
}): string => {
  if (!offsetProps) {
    return '';
  }

  const { offset, limit = 20 } = offsetProps;

  return `limit=${limit}&offset=${offset}`;
};

export const getSortParam = (eventType: ActivityTypeSortOptions): string => {
  const sortMap = new Map<ActivityTypeSortOptions, string>([
    [ActivityTypeSortOptions.ALL, ''],
    [ActivityTypeSortOptions.COMMIT, 'filter_by=type:COMMIT'],
    [ActivityTypeSortOptions.JOB, 'filter_by=type:JOB'],
    [ActivityTypeSortOptions.METADATA, 'filter_by=type:METADATA'],
    [ActivityTypeSortOptions.STATISTICS, 'filter_by=type:STATISTICS'],
    [ActivityTypeSortOptions.VALIDATIONS, 'filter_by=type:VALIDATIONS'],
  ]);

  return sortMap.get(eventType) || '';
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
    version?: number,
  ): Promise<FeatureGroup[]> => {
    const { data } = await this.request<FeatureGroup[]>({
      url: `${projectId}/featurestores/${featureStoreId}/featuregroups/${name}${
        !version ? '' : `?version=${version}`
      }`,
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

  getStatisticsCommits = (
    projectId: number,
    featureStoreId: number,
    featureGroupId: number,
  ) =>
    this.request<GetStatisticsData>({
      url: `${projectId}/featurestores/${featureStoreId}/featuregroups/${featureGroupId}/statistics`,
      type: RequestType.get,
    });

  getWriteLast = async (
    projectId: number,
    featureStoreId: number,
    featureGroupId: number,
  ): Promise<string> => {
    const { data } = await this.request<any>({
      url: `${projectId}/featurestores/${featureStoreId}/featuregroups/${featureGroupId}/provenance/usage?type=WRITE_LAST`,
      type: RequestType.get,
    });

    return (
      data?.writeLast?.timestamp &&
      new Date(data.writeLast.timestamp).toISOString()
    );
  };

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
        data.validationType.toUpperCase(),
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
  ) => {
    return this.request<any>({
      type: RequestType.put,
      url: `${projectId}/featurestores/${featureStoreId}/featuregroups/${fgId}/tags/${name}`,
      data,
    });
  };

  getActivity = (
    projectId: number,
    featureStoreId: number,
    fgId: number,
    eventType: ActivityTypeSortOptions,
    timeOptions?: {
      from?: number;
      to?: number;
    },
    offsetOptions?: {
      offset: number;
      limit?: number;
    },
    sortType: 'asc' | 'desc' = 'desc',
  ) =>
    this.request<{
      items: ActivityItemData[];
    }>({
      type: RequestType.get,
      url: `${projectId}/featurestores/${featureStoreId}/featuregroups/${fgId}/activity?${getExpandParam()}&${getSortParam(
        eventType,
      )}&${getTimeParam(timeOptions)}&${getOffsetParam(
        offsetOptions,
      )}&sort_by=TIMESTAMP:${sortType}`,
    });

  getTags = (projectId: number, featureStoreId: number, fgId: number) =>
    this.request<any>({
      type: RequestType.get,
      url: `${projectId}/featurestores/${featureStoreId}/featuregroups/${fgId}/tags?expand=tag_schemas`,
    });

  getOneByName = async (
    projectId: number,
    name: string,
    featureStoreId: number,
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

export interface StatisticsSplitData {
  name: string;
  content: string;
}

export interface GetStatisticsData {
  items?: {
    content: string;
    commitTime: number;
    splitStatistics: StatisticsSplitData[];
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
