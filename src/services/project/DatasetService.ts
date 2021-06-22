import { Dataset } from '../../types/dataset';
import BaseApiService, { RequestType } from '../BaseApiService';

class DatasetService extends BaseApiService {
  getList = (projectId: number) =>
    this.request<GetDatasets>({
      url: `${projectId}/dataset`,
      type: RequestType.get,
    });

  getDownloadToken = (projectId: number, path: string, type: DatasetType) =>
    this.request<DownloadToken>({
      url: `${projectId}/dataset/download/token/${encodeURIComponent(
        path,
      )}?type=${type}`,
      type: RequestType.get,
    });
}

export default new DatasetService('/project');

export enum DatasetType {
  DATASET = 'DATASET',
  FEATURESTORE = 'FEATURESTORE',
  HIVE = 'HIVE',
}

export interface DownloadTokenValue {
  type: string;
  value: string;
}

export interface DownloadToken {
  data: DownloadTokenValue;
  type: string;
}

export interface GetDatasets {
  count: number;
  href: string;
  items: Dataset[];
  type: string;
}
