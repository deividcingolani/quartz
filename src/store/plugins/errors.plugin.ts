import {
  Plugin,
  Models,
  Action,
  Reducer,
  NamedModel,
  ExtractRematchDispatchersFromEffects,
} from '@rematch/core';

export class EffectError<T = string> {
  // eslint-disable-next-line no-useless-constructor
  constructor(public readonly data: T, public readonly status: number) {}
}

interface ErrorState<TModels extends Models<TModels>> {
  effects: {
    [modelName in keyof TModels]: {
      [effectName in keyof ExtractRematchDispatchersFromEffects<
        TModels[modelName]['effects'],
        TModels
      >]: EffectError | null;
    };
  };
  globalError: EffectError | null;
  error: EffectError | null;
}

interface InitialErrorState {
  effects: {
    [modelName: string]: {
      [effectName: string]: EffectError | null;
    };
  };
  globalError: null;
  error: null;
}

interface ErrorModel<TModels extends Models<TModels>>
  extends NamedModel<TModels, ErrorState<TModels>> {
  reducers: {
    set: Reducer<ErrorState<TModels>>;
    clear: Reducer<ErrorState<TModels>>;
    clearGlobal: Reducer<ErrorState<TModels>>;
    clearError: Reducer<ErrorState<TModels>>;
  };
}

export interface ExtraModelsFromError<TModels extends Models<TModels>>
  extends Models<TModels> {
  error: ErrorModel<TModels>;
}

const initialErrorValue = null;

const setErrorAction = <TModels extends Models<TModels>>(
  state: ErrorState<TModels>,
  payload: Action<{
    name: string;
    action: string;
    error: EffectError | null;
    isGlobal?: boolean;
  }>['payload'],
): ErrorState<TModels> => {
  const {
    name = '',
    action = '',
    error = initialErrorValue,
    isGlobal = false,
  } = payload || {};

  return {
    ...state,
    globalError: isGlobal ? error : state.globalError,
    error: isGlobal ? state.error : error,
    effects: {
      ...state.effects,
      [name]: {
        ...state.effects[name],
        [action]: error,
      },
    },
  };
};

const clearErrorAction = <TModels extends Models<TModels>>(
  state: ErrorState<TModels>,
  payload: Action<{ name: string; action: string }>['payload'],
): ErrorState<TModels> => {
  const { name = '', action = '' } = payload || {};

  return {
    ...state,
    effects: {
      ...state.effects,
      [name]: {
        ...state.effects[name],
        [action]: null,
      },
    },
  };
};

const clearGlobalErrorAction = <TModels extends Models<TModels>>(
  state: ErrorState<TModels>,
): ErrorState<TModels> => {
  return {
    ...state,
    globalError: null,
  };
};

const clearNotGlobalAction = <TModels extends Models<TModels>>(
  state: ErrorState<TModels>,
): ErrorState<TModels> => {
  return {
    ...state,
    error: null,
  };
};

export interface ErrorsPluginOptions {
  whiteList: string[];
  globalErrors: Array<number>;
}

export default <
  TModels extends Models<TModels>,
  TExtraModels extends Models<TModels>
>(
  options?: ErrorsPluginOptions,
): Plugin<TModels, TExtraModels, ExtraModelsFromError<TModels>> => {
  const errorInitialState: InitialErrorState = {
    globalError: null,
    error: null,
    effects: {},
  };

  const error: ErrorModel<TModels> = {
    name: 'error',
    reducers: {
      set: setErrorAction,
      clear: clearErrorAction,
      clearGlobal: clearGlobalErrorAction,
      clearError: clearNotGlobalAction,
    },
    state: errorInitialState as ErrorState<TModels>,
  };

  return {
    config: {
      models: {
        error,
      },
    },
    onModel({ name }, rematch): void {
      if (['error', 'loading'].includes(name)) {
        return;
      }

      errorInitialState.effects[name] = {};

      const modelActions = rematch.dispatch[name];

      Object.keys(modelActions).forEach((action: string) => {
        const origEffect = rematch.dispatch[name][action];

        if (!origEffect.isEffect || options?.whiteList.includes(name)) {
          return;
        }

        errorInitialState.effects[name][action] = initialErrorValue;

        const effectWrapper = (...props: any): any => {
          rematch.dispatch.error.clearError();

          const effectResult = origEffect(...props);
          if (effectResult?.then) {
            effectResult.catch((err: any) => {
              if (err.isAxiosError) {
                const isGlobal = options?.globalErrors.includes(
                  err.status || err.response?.status,
                );
                rematch.dispatch.error.set({
                  name,
                  action,
                  error: err,
                  isGlobal,
                });
              } else {
                throw err;
              }
            });
          }

          return effectResult;
        };

        effectWrapper.isEffect = true;

        // eslint-disable-next-line no-param-reassign
        rematch.dispatch[name][action] = effectWrapper;
      });
    },
  };
};
