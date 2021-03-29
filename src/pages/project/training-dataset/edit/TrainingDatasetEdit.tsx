import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { TinyPopup, usePopup } from '@logicalclocks/quartz';
import React, { FC, memo, useCallback, useEffect } from 'react';

// Types
import { TrainingDatasetFormData } from '../types';
import { Dispatch, RootState } from '../../../../store';
// Components
import Loader from '../../../../components/loader/Loader';
import TrainingDatasetForm from '../forms/TrainingDatasetForm';
// Hooks
import useTitle from '../../../../hooks/useTitle';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';

import titles from '../../../../sources/titles';

const TrainingDatasetEdit: FC = () => {
  const { id: projectId, tdId } = useParams();

  const dispatch = useDispatch<Dispatch>();

  const navigate = useNavigateRelative();

  const [isPopupOpen, handleToggle] = usePopup();

  const featureStoreData = useSelector((state: RootState) =>
    state.featureStores?.length ? state.featureStores[0] : null,
  );

  useEffect(() => {
    if (featureStoreData?.featurestoreId) {
      dispatch.trainingDatasetView.fetch({
        projectId: +projectId,
        featureStoreId: featureStoreData.featurestoreId,
        trainingDatasetId: +tdId,
      });
      dispatch.schematisedTags.fetch();
      dispatch.featureGroupLabels.fetch({
        projectId: +projectId,
      });
    }
  }, [dispatch, projectId, featureStoreData, tdId]);

  const trainingDataset = useSelector(
    (state: RootState) => state.trainingDatasetView,
  );

  const handleSubmit = useCallback(
    async (data: TrainingDatasetFormData) => {
      const {
        dataFormat,
        rowFilters,
        joins,
        correlations,
        histograms,
        enabled,
        storage,
        statisticsColumns,
        ...restData
      } = data;

      dispatch.error.clear({
        name: 'trainingDatasets',
        action: 'edit',
      });

      if (featureStoreData?.featurestoreId) {
        await dispatch.trainingDatasets.edit({
          projectId: +projectId,
          featureStoreId: featureStoreData?.featurestoreId,
          trainingDatasetId: +tdId,
          data: {
            ...restData,
            statisticsConfig: {
              columns: statisticsColumns,
              correlations,
              enabled,
              histograms,
            },
          },
          prevTagNames: trainingDataset?.tags.map(({ name }) => name) || [],
        });

        dispatch.trainingDatasetView.clear();
        navigate(`/${tdId}`, 'p/:id/td/*');
      }
    },
    [dispatch, featureStoreData, navigate, projectId, tdId, trainingDataset],
  );

  const handleDelete = useCallback(async () => {
    if (featureStoreData?.featurestoreId) {
      handleToggle();
      await dispatch.trainingDatasets.delete({
        projectId: +projectId,
        featureStoreId: featureStoreData?.featurestoreId,
        trainingDatasetId: +tdId,
      });

      dispatch.trainingDatasets.fetch({
        projectId: +projectId,
        featureStoreId: featureStoreData.featurestoreId,
      });
      navigate('/td', 'p/:id/*');
    }
  }, [dispatch, featureStoreData, projectId, navigate, tdId, handleToggle]);

  const isFeatureStoreLoading = useSelector(
    (state: RootState) => state.loading.effects.featureStores.fetch,
  );

  const isKeywordsLoading = useSelector(
    (state: RootState) => state.loading.effects.featureGroups.fetch,
  );

  const isTagsLoading = useSelector(
    (state: RootState) => state.loading.effects.schematisedTags.fetch,
  );

  const isDeleting = useSelector(
    (state: RootState) => state.loading.effects.trainingDatasets.delete,
  );

  const isSubmit = useSelector(
    (state: RootState) => state.loading.effects.trainingDatasets.edit,
  );

  useTitle(`${titles.editTd} - ${trainingDataset?.name}`);

  if (isKeywordsLoading || isTagsLoading || !trainingDataset) {
    return <Loader />;
  }

  return (
    <>
      <TrainingDatasetForm
        isEdit={true}
        isLoading={isSubmit || isDeleting || isFeatureStoreLoading}
        isDisabled={isSubmit}
        submitHandler={handleSubmit}
        onDelete={handleToggle}
        initialData={trainingDataset}
      />
      <TinyPopup
        width="440px"
        title={`Delete ${trainingDataset.name}`}
        secondaryText="Once you delete a training dataset, there is no going back. Please be certain."
        isOpen={isPopupOpen}
        mainButton={['Delete training dataset', handleDelete]}
        secondaryButton={['Back', handleToggle]}
        onClose={handleToggle}
      />
    </>
  );
};

export default memo(TrainingDatasetEdit);
