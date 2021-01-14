import { createModel } from '@rematch/core';
import { Feature, FeatureGroup } from '../../../types/feature-group';

export interface FeatureGroupBasket {
  fg: FeatureGroup;
  projectId: number;
  features: Feature[];
}

export type BasketState = {
  featureGroups: FeatureGroupBasket[];
  isSwitched: boolean;
};

export type params = {
  projectId: number;
  features: Feature[];
  featureGroup: FeatureGroup;
};

export const localStorageKey = 'basket_data';

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
    setFeaturesData: (state: BasketState, payload: BasketState): BasketState =>
      payload,
    updateSwitch: (state: BasketState, payload: boolean): BasketState => ({
      ...state,
      isSwitched: payload,
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
    setStorage: (state: BasketState): BasketState => {
      localStorage.setItem(localStorageKey, JSON.stringify(state));

      return state;
    },
  },
  effects: (dispatch) => ({
    addFeatures: (params: params) => {
      dispatch.basket.addFeaturesData(params);
      dispatch.basket.setStorage();
    },
    deleteFeatures: (params: params) => {
      dispatch.basket.deleteFeaturesData(params);
      dispatch.basket.setStorage();
    },
    switch: (isSwitched: boolean) => {
      dispatch.basket.updateSwitch(isSwitched);
      dispatch.basket.setStorage();
    },
    clear: () => {
      dispatch.basket.clearData();
      dispatch.basket.setStorage();
    },
    getFromLocalStorage: () => {
      const data = localStorage.getItem(localStorageKey);

      if (data) {
        try {
          const parsed = JSON.parse(data);
          dispatch.basket.setFeaturesData(parsed);
        } catch (e) {}
      }
    },
    onUpdateStorage: () => {
      dispatch.basket.getFromLocalStorage();
    },
  }),
});

export default basket;
