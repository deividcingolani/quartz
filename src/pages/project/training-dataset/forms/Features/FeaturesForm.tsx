import {
  Button,
  Callout,
  CalloutTypes,
  CardSecondary,
  Value,
  InputValidation,
  Divider,
  usePopup,
} from '@logicalclocks/quartz';
import { Box, Flex } from 'rebass';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { FC, useCallback, useEffect, useState } from 'react';

// Types
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
import FeatureGroupJoinForm from './FeatureGroupJoinForm';
import CollapsedFeaturesForm from './CollapsedFeaturesForm';
import FeatureDrawer from '../../../../../components/feature-drawer/FeatureDrawer';
import SearchPopup from '../../../../../components/basket/BasketTutoPopup';
import { useFormContext } from 'react-hook-form';

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

  const isNewFeatures = useCallback(() => {
    return !!basket.find(({ features, fg }) => {
      const fgIndex = featureGroups.findIndex(({ fg: { id } }) => id === fg.id);

      if (fgIndex < 0) {
        return true;
      }

      const prevFeatures = featureGroups[fgIndex].features;

      return !!features.find(
        ({ name }) => !prevFeatures.find((feature) => feature.name === name),
      );
    });
  }, [featureGroups, basket]);

  const handleWithdrawBasket = useCallback(
    (clearBasket = false) => () => {
      updateFeatures();

      setOpen(true);

      if (clearBasket) {
        dispatch.basket.clear();
      }
    },
    [dispatch, updateFeatures],
  );

  const handleDeleteAllFg = useCallback(
    (index: number) => () => {
      const copy = featureGroups.slice();

      copy.splice(index, 1);

      setFeatureGroups(copy);
    },
    [featureGroups],
  );

  const handleDelete = useCallback(
    (index: number, featureName: string) => () => {
      const copy = featureGroups.slice();

      copy[index].features = copy[index].features.filter(
        ({ name }) => name !== featureName,
      );

      setFeatureGroups(copy);
    },
    [featureGroups],
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
    if (!featureGroups.length) {
      setOpen(false);
    }
  }, [featureGroups]);

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
          {!!featureLength ? (
            <Flex mt="8px">
              <Button
                mr="10px"
                onClick={handleWithdrawBasket()}
                disabled={!basket.length || !isNewFeatures() || isDisabled}
              >
                Pull out from basket
              </Button>
              <Button
                intent="secondary"
                onClick={handleWithdrawBasket(true)}
                disabled={!basket.length || !isNewFeatures() || isDisabled}
              >
                Pull out and clear basket
              </Button>
            </Flex>
          ) : (
            <Flex mt="8px">
              <Button
                disabled={isDisabled}
                onClick={() => window.open(`/p/${projectId}/fg`, '_blank')}
              >
                Select features ↗
              </Button>
              <Button
                intent="inline"
                disabled={isDisabled}
                onClick={handleToggleSearchPopup}
              >
                How to select features using the basket?
              </Button>
            </Flex>
          )}
          <Box my="8px">
            {!!featureLength ? (
              <InputValidation>
                {featureLength} features in the basket
              </InputValidation>
            ) : (
              <InputValidation>Your basket of feature is empty</InputValidation>
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
            {featureGroups.length > 1 && (
              <>
                <Divider mt="0" ml="0" width="100%" />
                <FeatureGroupJoinForm
                  isDisabled={isDisabled}
                  featureGroups={featureGroups}
                />
                <Divider ml="0" width="100%" />
                <RowFilters
                  isDisabled={isDisabled}
                  featureGroups={featureGroups}
                />
              </>
            )}
          </>
        )}
      </CardSecondary>
    </>
  );
};

export default FeaturesForm;
