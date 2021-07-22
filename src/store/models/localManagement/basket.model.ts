import { createModel } from '@rematch/core';
import BasketService, {
  BasketState,
  FeatureGroupBasket,
} from '../../../services/localStorage/BasketService';
import { Feature } from '../../../types/feature';
import { FeatureGroup } from '../../../types/feature-group';

export type params = {
  userId: number;
  projectId: number;
  features: Feature[];
  featureGroup: FeatureGroup;
};

export type switchParams = {
  userId: number;
  projectId: number;
  active: boolean;
};

export type getParams = {
  userId: number;
  projectId: number;
};

const addToBasket = (
  prevState: FeatureGroupBasket[],
  { features, featureGroup, projectId }: params,
): FeatureGroupBasket[] => {
  const fgIndex = prevState.findIndex(({ fg }) => fg.id === featureGroup.id);

  if (fgIndex < 0) {
    return [{ fg: featureGroup, features, projectId }, ...prevState];
  }

  const copy = prevState.slice();
  const prevFeatures = copy[fgIndex].features.filter(
    ({ name }) => !features.find((feature) => feature.name === name),
  );
  copy[fgIndex].features = [...features, ...prevFeatures];

  return copy;
};

const deleteFromBasket = (
  prevState: FeatureGroupBasket[],
  { features, featureGroup }: params,
): FeatureGroupBasket[] => {
  const fgIndex = prevState.findIndex(({ fg }) => fg.id === featureGroup.id);

  if (fgIndex < 0) {
    return prevState;
  }

  const copy = prevState.slice();
  const prevFeatures = copy[fgIndex].features;
  copy[fgIndex].features = prevFeatures.filter(
    ({ name }) => !features.some(({ name: newName }) => newName === name),
  );

  if (!copy[fgIndex].features.length) {
    copy.splice(fgIndex, 1);
  }

  return copy;
};

const basket = createModel()({
  state: { featureGroups: [], isSwitched: false } as BasketState,
  reducers: {
    setFeaturesData: (_state: BasketState, payload: BasketState): BasketState =>
      payload,
    updateSwitch: (state: BasketState, payload: switchParams): BasketState => ({
      ...state,
      isSwitched: payload.active,
    }),
    addFeaturesData: (state: BasketState, payload: params): BasketState => ({
      ...state,
      featureGroups: addToBasket(state.featureGroups, payload),
    }),
    deleteFeaturesData: (state: BasketState, payload: params): BasketState => ({
      ...state,
      featureGroups: deleteFromBasket(state.featureGroups, payload),
    }),
    clearData: (state: BasketState) => ({ ...state, featureGroups: [] }),
    setStorage: (state: BasketState, { userId, projectId }): BasketState => {
      BasketService.setAll(userId, projectId, state);
      return state;
    },
  },
  effects: (dispatch) => ({
    addFeatures: (params: params) => {
      const { userId, projectId } = params;
      dispatch.basket.addFeaturesData(params);
      dispatch.basket.setStorage({ userId, projectId });
    },
    deleteFeatures: (params: params) => {
      const { userId, projectId } = params;
      dispatch.basket.deleteFeaturesData(params);
      dispatch.basket.setStorage({ userId, projectId });
    },
    switch: (params: switchParams) => {
      const { userId, projectId } = params;
      dispatch.basket.updateSwitch(params);
      dispatch.basket.setStorage({ userId, projectId });
    },
    clear: (params: getParams) => {
      const { userId, projectId } = params;
      dispatch.basket.clearData();
      dispatch.basket.setStorage({ userId, projectId });
    },
    getFromLocalStorage: ({ userId, projectId }: getParams) => {
      const data = BasketService.getBasket(userId, projectId);
      if (data) {
        dispatch.basket.setFeaturesData(data);
      } else {
        dispatch.basket.clearData();
      }
    },
    onUpdateStorage: ({ userId, projectId }: getParams) => {
      dispatch.basket.getFromLocalStorage(userId, projectId);
    },
  }),
});

export default basket;
