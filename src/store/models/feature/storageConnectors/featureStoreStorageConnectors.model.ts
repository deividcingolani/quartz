import { createModel } from '@rematch/core';
import { FeatureStoreStorageConnector } from '../../../../types/feature-store';
import FeatureStoresService from '../../../../services/project/FeatureStoresService';
import { EffectError } from '../../../plugins/errors.plugin';

export type FeatureStoreStorageConnectorsState = FeatureStoreStorageConnector[];

const initialState: FeatureStoreStorageConnectorsState = [];

const featureStoreStorageConnectorsModel = createModel()({
  state: initialState,
  reducers: {
    setData: (
      _: FeatureStoreStorageConnectorsState,
      payload: FeatureStoreStorageConnectorsState,
    ): FeatureStoreStorageConnectorsState => payload,
    clear: (): FeatureStoreStorageConnectorsState => initialState,
  },
  effects: (dispatch) => ({
    fetch: async ({
      projectId,
      featureStoreId,
    }: {
      projectId: number;
      featureStoreId: number;
    }): Promise<void> => {
      const { data } = await FeatureStoresService.getStorageConnectors(
        projectId,
        featureStoreId,
      );

      if (data.length) {
        dispatch.featureStoreStorageConnectors.setData(data);
      }
    },
    fetchOne: async ({
      projectId,
      featureStoreId,
      connectorName,
    }: {
      projectId: number;
      featureStoreId: number;
      connectorName: string;
    }): Promise<void> => {
      const { data } = await FeatureStoresService.getStorageConnector(
        projectId,
        featureStoreId,
        connectorName,
      );

      if (data) {
        dispatch.featureStoreStorageConnectors.setData([data]);
      }
    },
    create: async ({
      projectId,
      featureStoreId,
      data,
    }: {
      projectId: number;
      featureStoreId: number;
      data: any;
    }): Promise<any> => {
      try {
        return await FeatureStoresService.create(
          projectId,
          featureStoreId,
          data,
        );
      } catch (error) {
        throw new EffectError(error.response.data, error.response.status);
      }
    },
    edit: async ({
      projectId,
      featureStoreId,
      connectorName,
      data,
    }: {
      projectId: number;
      featureStoreId: number;
      connectorName: string;
      data: any;
    }): Promise<any> => {
      try {
        return await FeatureStoresService.edit(
          projectId,
          featureStoreId,
          connectorName,
          data,
        );
      } catch (error) {
        throw new EffectError(error.response.data, error.response.status);
      }
    },
    delete: ({
      projectId,
      featureStoreId,
      connectorName,
    }: {
      projectId: number;
      featureStoreId: number;
      connectorName: string;
    }): Promise<any> => {
      return FeatureStoresService.delete(
        projectId,
        featureStoreId,
        connectorName,
      );
    },
  }),
});

export default featureStoreStorageConnectorsModel;
