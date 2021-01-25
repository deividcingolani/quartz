import { createModel } from '@rematch/core';
import APIService from '../../../services/APIService';

export type ScopeState = string[];

const scope = createModel()({
  state: [] as ScopeState,
  reducers: {
    setState: (_: ScopeState, payload: ScopeState): ScopeState => payload,
    clear: () => [],
  },
  effects: (dispatch) => ({
    fetch: async (): Promise<any> => {
      const { data = [] } = await APIService.getScopes();

      dispatch.scope.setState(data.map(({ value }) => value));
    },
  }),
});

export default scope;
