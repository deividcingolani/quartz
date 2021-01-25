import { Api } from '../../../types/api';
import { createModel } from '@rematch/core';
import APIService from '../../../services/APIService';

export type ApiState = Api[];

const api = createModel()({
  state: [] as ApiState,
  reducers: {
    setState: (_: ApiState, payload: ApiState): ApiState => payload,
    clear: () => [],
  },
  effects: (dispatch) => ({
    fetch: async (): Promise<any> => {
      const { data } = await APIService.getList();

      const { items = [] } = data;

      dispatch.api.setState(items);
    },
    create: async ({ data }: { data: any }): Promise<any> => {
      return APIService.create(data);
    },
    edit: async ({ data }: { data: any }): Promise<any> => {
      return APIService.edit(data);
    },
    delete: async (name: string): Promise<any> => {
      return APIService.delete(name);
    },
  }),
});

export default api;
