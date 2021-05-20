import { createModel } from '@rematch/core';
import { Secret } from '../../../types/secrets';
import SecretsService from '../../../services/SecretsService';

export type ApiState = Secret[];

const api = createModel()({
  state: [] as ApiState,
  reducers: {
    setState: (_: ApiState, payload: ApiState): ApiState => payload,
    clear: () => [],
  },
  effects: (dispatch) => ({
    fetchAll: async (): Promise<any> => {
      const { data } = await SecretsService.getList();
      const { items = [] } = data;
      dispatch.secrets.setState(items);

      const enriched = await Promise.all(
        items.map(
          async (item: Secret): Promise<Secret> => {
            const response = await SecretsService.get(item.name);
            const { items } = response.data;
            return { ...item, ...items[0] };
          },
        ),
      );
      dispatch.secrets.setState(enriched);
    },
    fetch: async (name: string): Promise<any> => {
      const { data } = await SecretsService.get(name);
      const { items = [] } = data;
      dispatch.secrets.setState(items);
    },
    create: async ({ data }: { data: any }): Promise<any> => {
      return SecretsService.create(data);
    },
    delete: async (name: string): Promise<any> => {
      return SecretsService.delete(name);
    },
  }),
});

export default api;
