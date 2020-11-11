import { createModel } from '@rematch/core';
import {
  FeatureStoreSource,
  StorageConnectorType,
} from '../../../../types/feature-store';
import FeatureStoresService from '../../../../services/project/FeatureStoresService';
import { EffectError } from '../../../plugins/errors.plugin';

export type FeatureStoreSourcesState = FeatureStoreSource[];

const initialState: FeatureStoreSourcesState = [];

const featureStoreSourcesModel = createModel()({
  state: initialState,
  reducers: {
    setData: (
      _: FeatureStoreSourcesState,
      payload: FeatureStoreSourcesState,
    ): FeatureStoreSourcesState => payload,
    clear: (): FeatureStoreSourcesState => initialState,
  },
  effects: (dispatch) => ({
    fetch: async ({
      projectId,
      featureStoreId,
    }: {
      projectId: number;
      featureStoreId: number;
    }): Promise<void> => {
      const { data } = await FeatureStoresService.getSources(
        projectId,
        featureStoreId,
      );

      if (data.length) {
        dispatch.featureStoreSources.setData(data);
      }
    },
    fetchOne: async ({
      projectId,
      featureStoreId,
      sourceId,
      connectorType,
    }: {
      projectId: number;
      featureStoreId: number;
      sourceId: number;
      connectorType: string;
    }): Promise<void> => {
      const { data } = await FeatureStoresService.getSource(
        projectId,
        featureStoreId,
        sourceId,
        connectorType,
      );

      if (data) {
        dispatch.featureStoreSources.setData([data]);
      }
    },
    create: async ({
      projectId,
      featureStoreId,
      storageConnectorType,
      data,
    }: {
      projectId: number;
      featureStoreId: number;
      storageConnectorType: StorageConnectorType;
      data: any;
    }): Promise<any> => {
      try {
        return await FeatureStoresService.create(
          projectId,
          featureStoreId,
          storageConnectorType,
          data,
        );
      } catch (error) {
        throw new EffectError(error.response.data, error.response.status);
      }
    },
    edit: async ({
      projectId,
      featureStoreId,
      storageConnectorType,
      connectorId,
      data,
    }: {
      projectId: number;
      featureStoreId: number;
      storageConnectorType: StorageConnectorType;
      connectorId: number;
      data: any;
    }): Promise<any> => {
      try {
        return await FeatureStoresService.edit(
          projectId,
          featureStoreId,
          storageConnectorType,
          connectorId,
          data,
        );
      } catch (error) {
        throw new EffectError(error.response.data, error.response.status);
      }
    },
    delete: ({
      projectId,
      featureStoreId,
      storageConnectorType,
      connectorId,
    }: {
      projectId: number;
      featureStoreId: number;
      storageConnectorType: StorageConnectorType;
      connectorId: number;
    }): Promise<any> => {
      return FeatureStoresService.delete(
        projectId,
        featureStoreId,
        storageConnectorType,
        connectorId,
      );
    },
  }),
});

export default featureStoreSourcesModel;
