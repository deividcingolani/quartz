import { createModel, RematchDispatch } from '@rematch/core';
import { RootModel } from '../index';
import * as types from './types';
import SourceService from '../../../services/project/SourceService';
import {
  ICreateAWSSource,
  ICreateJDBCSource,
  ISource,
  StorageConnectorType,
} from '../../../types/source';
import { AxiosResponse } from 'axios';

const initialState: types.SourceState = [];

const fetch = (dispatch: RematchDispatch<RootModel>) => async ({
  projectId,
  featureStoreId,
}: {
  projectId: number;
  featureStoreId: number;
}): Promise<void> => {
  dispatch.sources.clear();
  const data = await SourceService.getList(projectId, featureStoreId);
  dispatch.sources.set(data);
};

const create = () => async ({
  projectId,
  featureStoreId,
  source,
  type,
}: {
  projectId: number;
  featureStoreId: number;
  type: StorageConnectorType;
  source?: ICreateAWSSource | ICreateJDBCSource;
}): Promise<AxiosResponse> => {
  if (source) {
    return SourceService.createSource(projectId, featureStoreId, type, source);
  }
  return Promise.reject();
};

export const sourceModel = createModel<RootModel>()({
  state: initialState,
  reducers: {
    set: (s, p: ISource[]): types.SourceState => p,
    clear: () => initialState,
  },
  effects: (dispatch) => ({
    fetch: fetch(dispatch),
    create: create(),
  }),
});
