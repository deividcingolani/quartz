import {
  Button,
  Callout,
  CalloutTypes,
  CardSecondary,
  Value,
  InputValidation,
  usePopup,
  Divider,
} from '@logicalclocks/quartz';
import { Box, Flex } from 'rebass';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { FC, useCallback, useState, useEffect } from 'react';

// Types
import { useFormContext } from 'react-hook-form';
import { Dispatch, RootState } from '../../../../../store';
import { FeatureGroupBasket } from '../../../../../store/models/localManagement/basket.model';
import { Feature } from '../../../../../types/feature-group';
// Selectors
import {
  selectBasketFeaturesLength,
  selectFeatureGroups,
} from '../../../../../store/models/localManagement/basket.selectors';
// Hooks
import useDrawer from '../../../../../hooks/useDrawer';
// Components
import RowFilters from './RowFilters';
import SearchPopup from '../../../../../components/basket/BasketTutoPopup';
import FeatureGroupJoinForm from './FeatureGroupJoinForm';
import CollapsedFeaturesForm from './CollapsedFeaturesForm';
import FeatureDrawer from '../../../../../components/feature-drawer/FeatureDrawer';

import routeNames from '../../../../../routes/routeNames';

export interface SelectedState {
  fgId: number;
  feature?: Feature;
}

const FeaturesForm: FC<{ isDisabled: boolean }> = ({ isDisabled }) => {
  const { id: projectId } = useParams();

  const { handleSelectItem, handleClose } = useDrawer();
  const { setValue } = useFormContext();

  const [isOpen, setOpen] = useState<boolean>(false);

  const featureLength = useSelector(selectBasketFeaturesLength);

  const featureStoreData = useSelector((state: RootState) =>
    state.featureStores?.length ? state.featureStores[0] : null,
  );

  const [featureGroups, setFeatureGroups] = useState<FeatureGroupBasket[]>([]);

  const error = useSelector(
    (state: RootState) => state.error.effects.trainingDatasets.create,
  );

  const dispatch = useDispatch<Dispatch>();

  const basket = useSelector(selectFeatureGroups);

  const [selectedFeature, setSelected] = useState<SelectedState>();

  const [isOpenSearchPopup, handleToggleSearchPopup] = usePopup(false);
  const updateFeatures = useCallback(() => {
    const copy = featureGroups.slice();
    basket.forEach(({ features, fg, projectId }) => {
      const fgIndex = copy.findIndex(({ fg: { id } }) => id === fg.id);

      if (fgIndex < 0) {
        copy.unshift({
          fg,
          projectId,
          features,
        });
      } else {
        const newFeatures = features.filter(
          ({ name }) =>
            !copy[fgIndex].features.find((feature) => feature.name === name),
        );
        copy[fgIndex].features = [...newFeatures, ...copy[fgIndex].features];
      }
    });

    setFeatureGroups(copy);
  }, [featureGroups, basket]);

  useEffect(() => {
    updateFeatures();
    setOpen(true);
  }, [basket]);

  const navigate = useNavigate();
  const handleDeleteAllFg = useCallback(
    (index: number) => () => {
      const copy = featureGroups.slice();
      dispatch.basket.deleteFeatures({
        features: copy[index].features,
        featureGroup: copy[index].fg,
        projectId: +projectId,
      });
      copy.splice(index, 1);

      setFeatureGroups(copy);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [featureGroups, basket],
  );

  const handleDelete = useCallback(
    (index: number, featureName: string) => () => {
      const copy = featureGroups.slice();

      dispatch.basket.deleteFeatures({
        features: copy[index].features,
        featureGroup: copy[index].fg,
        projectId: +projectId,
      });

      copy[index].features = copy[index].features.filter(
        ({ name }) => name !== featureName,
      );

      dispatch.basket.addFeatures({
        features: copy[index].features,
        featureGroup: copy[index].fg,
        projectId: +projectId,
      });

      setFeatureGroups(copy);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [featureGroups, basket, projectId],
  );

  const handleGoToFG = useCallback(
    () => () => {
      dispatch.basket.switch(true);
      navigate(`/p/${projectId}/${routeNames.featureGroup.list}`);
    },
    [dispatch.basket, navigate, projectId],
  );

  const handleOpenStatistics = useCallback(
    (fgId: number, name: string) => () => {
      setSelected({
        fgId,
        feature: featureGroups
          .find(({ fg }) => fg.id === fgId)
          ?.features.find(({ name: featureName }) => featureName === name),
      });

      handleSelectItem(fgId);
    },
    [featureGroups, handleSelectItem],
  );

  useEffect(() => {
    setValue('features', featureGroups);
  }, [featureGroups, setValue]);

  return (
    <>
      <SearchPopup
        isOpen={isOpenSearchPopup}
        handleToggle={handleToggleSearchPopup}
      />
      {!!selectedFeature?.feature &&
        !!selectedFeature.fgId &&
        featureStoreData?.featurestoreId && (
          <FeatureDrawer
            projectId={+projectId}
            isOpen={!!selectedFeature.fgId}
            featureStoreId={featureStoreData.featurestoreId}
            handleToggle={() => {
              handleClose();
              setSelected({ fgId: 0, feature: undefined });
            }}
            feature={selectedFeature?.feature}
            fgId={selectedFeature?.fgId}
          />
        )}
      <CardSecondary title="Features" mb="20px">
        <Flex flexDirection="column">
          <Value>Selected Features</Value>
          <Flex mt="8px">
            <Button onClick={handleGoToFG()}>
              Pick features from the UI ↗
            </Button>
            <Button intent="inline" onClick={handleToggleSearchPopup}>
              How to pick features using from the UI?
            </Button>
          </Flex>
          <Box my="8px">
            {!featureLength && (
              <InputValidation>
                You have not selected any feature
              </InputValidation>
            )}
          </Box>
          {!!error && (
            <Box mt="20px">
              <Callout
                type={CalloutTypes.neutral}
                content="Could not find any matching feature to join"
              />
            </Box>
          )}
        </Flex>
        {isOpen && (
          <>
            <CollapsedFeaturesForm
              isDisabled={isDisabled}
              handleDelete={handleDelete}
              featureGroups={featureGroups}
              handleDeleteAllFg={handleDeleteAllFg}
              handleOpenStatistics={handleOpenStatistics}
            />
            <FeatureGroupJoinForm
              isDisabled={isDisabled}
              featureGroups={featureGroups}
            />
            <Divider ml="0" width="100%" />
            <RowFilters isDisabled={isDisabled} featureGroups={featureGroups} />
          </>
        )}
      </CardSecondary>
    </>
  );
};

export default FeaturesForm;
