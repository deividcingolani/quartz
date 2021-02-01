// Types
import {
  FeatureStore,
  FeatureStoreStorageConnector,
} from '../../types/feature-store';
import BaseApiService, { RequestType } from '../BaseApiService';

class FeatureStoresService extends BaseApiService {
  getList = async (projectId: number): Promise<FeatureStore[]> => {
    const { data } = await this.request<FeatureStore[]>({
      url: `${projectId}/featurestores`,
      type: RequestType.get,
    });

    return data;
  };

  getStorageConnectors = (projectId: number, featureStoreId: number) =>
    this.request<FeatureStoreStorageConnector[]>({
      url: `${projectId}/featurestores/${featureStoreId}/storageconnectors`,
    });

  getStorageConnector = (
    projectId: number,
    featureStoreId: number,
    connectorName: string,
  ) =>
    this.request<FeatureStoreStorageConnector[]>({
      url: `${projectId}/featurestores/${featureStoreId}/storageconnectors/${connectorName}`,
    });

  create = (projectId: number, featureStoreId: number, data: any) =>
    this.request<FeatureStoreStorageConnector[]>({
      type: RequestType.post,
      url: `${projectId}/featurestores/${featureStoreId}/storageconnectors`,
      data,
    });

  edit = (
    projectId: number,
    featureStoreId: number,
    connectorName: string,
    data: any,
  ) =>
    this.request<FeatureStoreStorageConnector[]>({
      type: RequestType.put,
      url: `${projectId}/featurestores/${featureStoreId}/storageconnectors/${connectorName}`,
      data,
    });

  delete = (projectId: number, featureStoreId: number, connectorName: string) =>
    this.request<FeatureStoreStorageConnector[]>({
      type: RequestType.delete,
      url: `${projectId}/featurestores/${featureStoreId}/storageconnectors/${connectorName}`,
    });
}

export default new FeatureStoresService('/project');
