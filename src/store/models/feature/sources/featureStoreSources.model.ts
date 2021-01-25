import { createModel } from '@rematch/core';
import { FeatureStoreSource } from '../../../../types/feature-store';
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
      connectorName,
    }: {
      projectId: number;
      featureStoreId: number;
      connectorName: string;
    }): Promise<void> => {
      const { data } = await FeatureStoresService.getSource(
        projectId,
        featureStoreId,
        connectorName,
      );

      if (data) {
        dispatch.featureStoreSources.setData([data]);
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

export default featureStoreSourcesModel;
