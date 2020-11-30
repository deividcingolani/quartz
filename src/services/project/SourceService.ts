import { AxiosResponse } from 'axios';
import BaseApiService, { RequestType } from '../BaseApiService';
import { ISource, StorageConnectorType } from '../../types/source';

class SourceService extends BaseApiService {
  getList = async (
    projectId: number,
    featureStoreId: number,
  ): Promise<ISource[]> => {
    const { data } = await this.request<any>({
      url: `${projectId}/featurestores/${featureStoreId}/storageconnectors`,
      type: RequestType.get,
    });

    return data || [];
  };

  createSource = async (
    projectId: number,
    featureStoreId: number,
    storageConnectorType: StorageConnectorType,
    data: any,
  ): Promise<AxiosResponse> =>
    this.request<any>({
      url: `${projectId}/featurestores/${featureStoreId}/storageconnectors/${storageConnectorType}`,
      type: RequestType.post,
      data: {
        ...data,
        storageConnectorType,
      },
    });
}

export default new SourceService('/project');
