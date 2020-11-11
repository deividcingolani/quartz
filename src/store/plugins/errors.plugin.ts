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
  constructor(public readonly data: T, public readonly status?: number) {}
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
}

interface InitialErrorState {
  effects: {
    [modelName: string]: {
      [effectName: string]: EffectError | null;
    };
  };
}

interface ErrorModel<TModels extends Models<TModels>>
  extends NamedModel<TModels, ErrorState<TModels>> {
  reducers: {
    set: Reducer<ErrorState<TModels>>;
    clear: Reducer<ErrorState<TModels>>;
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
    error: Error | null;
  }>['payload'],
): ErrorState<TModels> => {
  const { name = '', action = '', error = initialErrorValue } = payload || {};

  return {
    ...state,
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

export default <
  TModels extends Models<TModels>,
  TExtraModels extends Models<TModels>
>(): Plugin<TModels, TExtraModels, ExtraModelsFromError<TModels>> => {
  const errorInitialState: InitialErrorState = {
    effects: {},
  };

  const error: ErrorModel<TModels> = {
    name: 'error',
    reducers: {
      set: setErrorAction,
      clear: clearErrorAction,
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

        if (!origEffect.isEffect) {
          return;
        }

        errorInitialState.effects[name][action] = initialErrorValue;

        const effectWrapper = (...props: any): any => {
          rematch.dispatch.error.clear();

          const effectResult = origEffect(...props);

          if (effectResult?.then) {
            effectResult.catch((err: any) => {
              if (err instanceof EffectError) {
                rematch.dispatch.error.set({ name, action, error: err });
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
