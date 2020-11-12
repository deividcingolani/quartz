import { init, RematchDispatch, RematchRootState } from '@rematch/core';
import loadingPlugin, { ExtraModelsFromLoading } from '@rematch/loading';
import immerPlugin from '@rematch/immer';
import errorPlugin, { ExtraModelsFromError } from './plugins/errors.plugin';

import models, { RootModel } from './models';

type FullModel = ExtraModelsFromLoading<RootModel> &
  ExtraModelsFromError<RootModel>;

export const store = init<RootModel, FullModel>({
  models,
  plugins: [
    loadingPlugin(),
    immerPlugin({ whitelist: ['selectedProject'] }),
    errorPlugin({ globalErrors: [401, 404] }),
  ],
});

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;
