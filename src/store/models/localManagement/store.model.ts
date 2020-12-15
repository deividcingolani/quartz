import { createModel } from '@rematch/core';

export type StoreState = {
  lastProject: any;
};

const store = createModel()({
  state: { lastProject: null } as StoreState,
  reducers: {
    setData: (state: StoreState, payload: StoreState): StoreState => payload,
    clear: () => ({ lastProject: null }),
  },
  effects: (dispatch) => ({
    setProject: async ({ projectId }: { projectId: number }): Promise<void> => {
      dispatch.store.setData({ lastProject: projectId });
    },
  }),
});

export default store;
