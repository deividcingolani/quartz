import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch, RootState } from '../store';
import {
  selectFeatureGroups,
  selectSwitch,
} from '../store/models/localManagement/basket.selectors';
import { FeatureGroup } from '../types/feature-group';
import { Feature } from '../types/feature';

const useBasket = () => {
  const { id: projectId } = useParams();

  const isSwitch = useSelector(selectSwitch);
  const featureGroups = useSelector(selectFeatureGroups);

  const { id: userId } = useSelector((state: RootState) => state.profile);

  const dispatch = useDispatch<Dispatch>();

  const isActiveFeature = useCallback(
    ({ name }: Feature, { id }: FeatureGroup) => {
      return !!featureGroups.find(
        ({ features, fg }) =>
          !!features.find(({ name: featureName }) => featureName === name) &&
          fg.id === id,
      );
    },
    [featureGroups],
  );

  const isActiveFeatures = useCallback(
    (features: Feature[], parent: FeatureGroup) => {
      return features.every((f) => isActiveFeature(f, parent));
    },
    [isActiveFeature],
  );

  const handleBasket = useCallback(
    (features: Feature[], parent: FeatureGroup) => () => {
      if (isActiveFeatures(features, parent)) {
        dispatch.basket.deleteFeatures({
          features,
          featureGroup: parent,
          projectId: +projectId,
          userId,
        });
      } else {
        dispatch.basket.addFeatures({
          features,
          featureGroup: parent,
          projectId: +projectId,
          userId,
        });
      }
    },
    [dispatch, isActiveFeatures, projectId, userId],
  );

  return {
    isSwitch,
    handleBasket,
    isActiveFeature,
    isActiveFeatures,
  };
};

export default useBasket;
