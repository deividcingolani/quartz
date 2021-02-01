import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { FC, memo, useCallback, useEffect } from 'react';

// Types
import { TrainingDatasetFormData } from '../types';
import { Dispatch, RootState } from '../../../../store';
// Utils
import { dataFormatMap, mapFeatures } from '../utils';
// Components
import Loader from '../../../../components/loader/Loader';
import TrainingDatasetForm from '../forms/TrainingDatasetForm';
// Hooks
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import useTitle from '../../../../hooks/useTitle';
import titles from '../../../../sources/titles';

const TrainingDatasetCreate: FC = () => {
  useTitle(titles.createTrainingDataset);

  const { id: projectId } = useParams();

  const dispatch = useDispatch<Dispatch>();

  const navigate = useNavigateRelative();

  const featureStoreData = useSelector((state: RootState) =>
    state.featureStores?.length ? state.featureStores[0] : null,
  );

  useEffect(() => {
    if (featureStoreData?.featurestoreId) {
      dispatch.schematisedTags.fetch();
      dispatch.featureStoreStorageConnectors.fetch({
        projectId: +projectId,
        featureStoreId: featureStoreData?.featurestoreId,
      });
      dispatch.featureGroupLabels.fetch({
        projectId: +projectId,
      });
    }
  }, [dispatch, projectId, featureStoreData]);

  const handleSubmit = useCallback(
    async (data: TrainingDatasetFormData) => {
      const {
        dataFormat,
        features,
        correlations,
        histograms,
        enabled,
        storage,
        ...restData
      } = data;

      dispatch.error.clear({
        name: 'trainingDatasets',
        action: 'create',
      });

      if (featureStoreData?.featurestoreId) {
        const id = await dispatch.trainingDatasets.create({
          projectId: +projectId,
          featureStoreId: featureStoreData?.featurestoreId,
          data: {
            ...restData,
            version: 1,
            dataFormat: dataFormatMap.getByKey(dataFormat[0]),
            trainingDatasetType:
              storage.storageConnectorType === 'S3'
                ? 'EXTERNAL_TRAINING_DATASET'
                : 'HOPSFS_TRAINING_DATASET',
            storageConnector: {
              id: storage.id,
            },
            queryDTO: mapFeatures(features),
            statisticsConfig: {
              columns: [],
              correlations,
              enabled,
              histograms,
            },
          },
        });

        if (id) {
          dispatch.trainingDatasets.clear();
          navigate(`/${id}`, 'p/:id/td/*');
        }
      }
    },
    [dispatch, featureStoreData, navigate, projectId],
  );

  const isFeatureStoreLoading = useSelector(
    (state: RootState) => state.loading.effects.featureStores.fetch,
  );

  const isKeywordsLoading = useSelector(
    (state: RootState) => state.loading.effects.featureGroupLabels.fetch,
  );

  const isTagsLoading = useSelector(
    (state: RootState) => state.loading.effects.schematisedTags.fetch,
  );

  const isSubmit = useSelector(
    (state: RootState) => state.loading.effects.trainingDatasets.create,
  );

  if (isKeywordsLoading || isTagsLoading) {
    return <Loader />;
  }

  return (
    <>
      <TrainingDatasetForm
        isLoading={isFeatureStoreLoading}
        isDisabled={isSubmit}
        submitHandler={handleSubmit}
      />
    </>
  );
};

export default memo(TrainingDatasetCreate);
