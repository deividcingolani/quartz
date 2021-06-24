import { createModel, RematchDispatch } from '@rematch/core';
import { AxiosResponse } from 'axios';
import { RootModel } from '../index';
import * as types from './types';
import StorageConnectorService from '../../../services/project/StorageConnectorService';
import {
  ICreateAWSStorageConnector,
  ICreateJDBCStorageConnector,
  ICreateHOPSFSStorageConnector,
  ICreateREDSHIFTStorageConnector,
  IStorageConnector,
  StorageConnectorType,
  ICreateSnowflakeConnector,
} from '../../../types/storage-connector';

const initialState: types.StorageConnectorState = [];

const fetch =
  (dispatch: RematchDispatch<RootModel>) =>
  async ({
    projectId,
    featureStoreId,
  }: {
    projectId: number;
    featureStoreId: number;
  }): Promise<void> => {
    dispatch.storageConnectors.clear();
    const data = await StorageConnectorService.getList(
      projectId,
      featureStoreId,
    );
    dispatch.storageConnectors.set(data);
  };

const create =
  () =>
  async ({
    projectId,
    featureStoreId,
    storageConnector,
    type,
  }: {
    projectId: number;
    featureStoreId: number;
    type: StorageConnectorType;
    storageConnector?:
      | ICreateAWSStorageConnector
      | ICreateJDBCStorageConnector
      | ICreateHOPSFSStorageConnector
      | ICreateREDSHIFTStorageConnector
      | ICreateSnowflakeConnector;
  }): Promise<AxiosResponse> => {
    if (storageConnector) {
      return StorageConnectorService.createStorageConnector(
        projectId,
        featureStoreId,
        type,
        storageConnector,
      );
    }
    return Promise.reject();
  };

const storageConnectorModel = createModel<RootModel>()({
  state: initialState,
  reducers: {
    set: (_s, p: IStorageConnector[]): types.StorageConnectorState => p,
    clear: () => initialState,
  },
  effects: (dispatch) => ({
    fetch: fetch(dispatch),
    create: create(),
  }),
});

export default { storageConnectorModel };
