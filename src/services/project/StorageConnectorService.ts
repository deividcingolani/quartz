import { AxiosResponse } from 'axios';
import BaseApiService, { RequestType } from '../BaseApiService';
import {
  IStorageConnector,
  StorageConnectorType,
} from '../../types/storage-connector';

class StorageConnectorService extends BaseApiService {
  getList = async (
    projectId: number,
    featureStoreId: number,
  ): Promise<IStorageConnector[]> => {
    const { data } = await this.request<any>({
      url: `${projectId}/featurestores/${featureStoreId}/storageconnectors`,
      type: RequestType.get,
    });

    return data || [];
  };

  createStorageConnector = async (
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

export default new StorageConnectorService('/project');
