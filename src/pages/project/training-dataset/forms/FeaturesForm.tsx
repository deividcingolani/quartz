import {
  Badge,
  Button,
  Callout,
  CalloutTypes,
  Card,
  IconButton,
  Labeling,
  Value,
} from '@logicalclocks/quartz';
import { Box, Flex } from 'rebass';
import { useParams } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import React, { FC, useCallback, useEffect, useState } from 'react';

// Types
import { Dispatch, RootState } from '../../../../store';
import { Feature } from '../../../../types/feature-group';
import { FeatureGroupBasket } from '../../../../store/models/localManagement/basket.model';
// Selectors
import FeatureDrawer from '../../../../components/feature-drawer/FeatureDrawer';
import { selectFeatureGroups } from '../../../../store/models/localManagement/basket.selectors';
// Hooks
import useDrawer from '../../../../hooks/useDrawer';

export interface SelectedState {
  fgId: number;
  feature?: Feature;
}

const FeaturesForm: FC = () => {
  const { id: projectId } = useParams();

  const { setValue } = useFormContext();

  const [isOpen, setOpen] = useState<boolean>();

  const { handleSelectItem, handleClose } = useDrawer();

  const featureStoreData = useSelector((state: RootState) =>
    state.featureStores?.length ? state.featureStores[0] : null,
  );

  const error = useSelector(
    (state: RootState) => state.error.effects.trainingDatasets.create,
  );

  const dispatch = useDispatch<Dispatch>();

  const basket = useSelector(selectFeatureGroups);

  const [featureGroups, setFeatureGroups] = useState<FeatureGroupBasket[]>([]);

  const [selectedFeature, setSelected] = useState<SelectedState>();

  useEffect(() => {
    setValue('features', featureGroups);
  }, [featureGroups, setValue]);

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

  const handleDelete = useCallback(
    (index: number, featureName: string) => () => {
      const copy = featureGroups.slice();

      copy[index].features = copy[index].features.filter(
        ({ name }) => name !== featureName,
      );

      if (!copy[index].features.length) {
        copy.splice(index, 1);
      }

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

  return (
    <>
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
      <Card mb="100px">
        <Flex flexDirection="column">
          <Value>Withdraw features from a basket</Value>
          <Flex mt="10px">
            <Button
              mr="10px"
              disabled={!basket.length || !isNewFeatures()}
              onClick={handleWithdrawBasket()}
            >
              Withdraw basket
            </Button>
            <Button
              intent="secondary"
              disabled={!basket.length || !isNewFeatures()}
              onClick={handleWithdrawBasket(true)}
            >
              Withdraw and clear basket
            </Button>
          </Flex>
          <Box mt="20px">
            <Callout
              type={CalloutTypes.neutral}
              content="Joins will be performed on the maximum matching subset of feature group primary keys. Please use the SDK for advanced joining."
            />
          </Box>
          {!!error && (
            <Box mt="20px">
              <Callout
                type={CalloutTypes.error}
                content="Could not find any matching feature to join"
              />
            </Box>
          )}
        </Flex>
        {isOpen && (
          <Flex mt="5px" flexDirection="column">
            {!featureGroups.length && (
              <Value mt="10px">No features selected</Value>
            )}

            {featureGroups.map(({ fg, features, projectId }, index) => (
              <Flex key={fg.id} mt="15px" flexDirection="column">
                <Flex>
                  <Value primary>{features.length}</Value>
                  <Value ml="5px">features from</Value>
                  <Value
                    ml="5px"
                    sx={{ cursor: 'pointer' }}
                    onClick={() =>
                      window.open(`/p/${projectId}/fg/${fg.id}`, '_blank')
                    }
                  >
                    {fg.name}
                  </Value>
                  <Value ml="5px" sx={{ color: 'labels.orange' }}>
                    #{fg.id}
                  </Value>
                  <Labeling ml="5px" gray>
                    version {fg.version}
                  </Labeling>
                </Flex>
                <Flex mt="5px" flexDirection="column">
                  {features.map(({ name, description, type }) => (
                    <Flex
                      py="15px"
                      px="20px"
                      mx="-20px"
                      alignItems="center"
                      key={`${fg.id}-${name}`}
                      justifyContent="space-between"
                      sx={{ border: '1px solid #F5F5F5' }}
                    >
                      <Flex alignItems="center">
                        <IconButton
                          icon={['far', 'eye']}
                          tooltip="Show statistics"
                          onClick={handleOpenStatistics(fg.id, name)}
                        />
                        <Value ml="10px">{name}</Value>
                        <Value ml="20px">{description || '-'}</Value>
                      </Flex>
                      <Flex alignItems="center">
                        <Badge
                          mr="20px"
                          height="100%"
                          variant="bold"
                          value={type}
                        />
                        <IconButton
                          onClick={handleDelete(index, name)}
                          tooltip="Delete"
                          icon="trash-alt"
                        />
                      </Flex>
                    </Flex>
                  ))}
                </Flex>
              </Flex>
            ))}
          </Flex>
        )}
      </Card>
    </>
  );
};

export default FeaturesForm;
