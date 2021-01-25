import { Dataset } from '../../types/dataset';
import BaseApiService, { RequestType } from '../BaseApiService';

class DatasetService extends BaseApiService {
  getList = (projectId: number) =>
    this.request<GetDatasets>({
      url: `${projectId}/dataset`,
      type: RequestType.get,
    });
}

export default new DatasetService('/project');

export interface GetDatasets {
  count: number;
  href: string;
  items: Dataset[];
  type: string;
}
