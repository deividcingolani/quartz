import { createModel } from '@rematch/core';

export type StoreState = {
  lastProject: any;
  history: string[];
};

export const schematisedTagAddEvent = 'TAGS_CHANGE';

const store = createModel()({
  state: { lastProject: null, history: [] } as StoreState,
  reducers: {
    setData: (state: StoreState, payload: StoreState): StoreState => ({
      ...state,
      ...payload,
    }),
    addPath: (state: StoreState, payload: string): StoreState => ({
      ...state,
      history: [...state.history, payload],
    }),
    clear: () => ({ lastProject: null, history: [] }),
  },
  effects: (dispatch) => ({
    setProject: async ({ projectId }: { projectId: number }): Promise<void> => {
      dispatch.store.setData({ lastProject: projectId });
    },
    addHistoryPath: async ({ path }: { path: string }): Promise<void> => {
      dispatch.store.addPath(path);
    },
  }),
});

export default store;
