import { RootState } from '../../index';

export const selectFeatureGroups = (state: RootState) =>
  state.basket.featureGroups;

export const selectBasketFeaturesLength = (state: RootState) =>
  state.basket.featureGroups.reduce(
    (acc, { features }) => acc + features.length,
    0,
  );

export const selectSwitch = (state: RootState) => state.basket.isSwitched;
