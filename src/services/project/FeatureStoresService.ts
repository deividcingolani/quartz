// Types
import {
  FeatureStore,
  FeatureStoreSource,
  StorageConnectorType,
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

  getSources = (projectId: number, featureStoreId: number) =>
    this.request<FeatureStoreSource[]>({
      url: `${projectId}/featurestores/${featureStoreId}/storageconnectors`,
    });

  getSource = (
    projectId: number,
    featureStoreId: number,
    sourceId: number,
    connectorType: string,
  ) =>
    this.request<FeatureStoreSource[]>({
      url: `${projectId}/featurestores/${featureStoreId}/storageconnectors/${connectorType}/${sourceId}`,
    });

  create = (
    projectId: number,
    featureStoreId: number,
    storageConnectorType: StorageConnectorType,
    data: any,
  ) =>
    this.request<FeatureStoreSource[]>({
      type: RequestType.post,
      url: `${projectId}/featurestores/${featureStoreId}/storageconnectors/${storageConnectorType}`,
      data: data,
    });
  edit = (
    projectId: number,
    featureStoreId: number,
    storageConnectorType: StorageConnectorType,
    connectorId: number,
    data: any,
  ) =>
    this.request<FeatureStoreSource[]>({
      type: RequestType.put,
      url: `${projectId}/featurestores/${featureStoreId}/storageconnectors/${storageConnectorType}/${connectorId}`,
      data: data,
    });

  delete = (
    projectId: number,
    featureStoreId: number,
    storageConnectorType: StorageConnectorType,
    connectorId: number,
  ) =>
    this.request<FeatureStoreSource[]>({
      type: RequestType.delete,
      url: `${projectId}/featurestores/${featureStoreId}/storageconnectors/${storageConnectorType}/${connectorId}`,
    });
}

export default new FeatureStoresService('project');
