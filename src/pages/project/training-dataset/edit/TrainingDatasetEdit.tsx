// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { TinyPopup, usePopup } from '@logicalclocks/quartz';

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
import TdInfoService from '../../../../services/localStorage/TdInfoService';

const TrainingDatasetEdit: FC = () => {
  const { id: projectId, fsId, tdId } = useParams();
  const { id: userId } = useSelector((state: RootState) => state.profile);

  const dispatch = useDispatch<Dispatch>();

  const navigate = useNavigateRelative();

  const [isPopupOpen, handleToggle] = usePopup();

  useEffect(() => {
    dispatch.trainingDatasetView.fetch({
      projectId: +projectId,
      featureStoreId: +fsId,
      trainingDatasetId: +tdId,
    });
    dispatch.schematisedTags.fetch();
    dispatch.featureGroupLabels.fetch({
      projectId: +projectId,
    });
  }, [dispatch, projectId, fsId, tdId]);

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

      await dispatch.trainingDatasets.edit({
        projectId: +projectId,
        featureStoreId: +fsId,
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

      TdInfoService.delete({
        userId,
        projectId: +projectId,
      });

      navigate(`/${tdId}`, 'p/:id/fs/:fsId/td/*');
    },
    [
      dispatch.error,
      dispatch.trainingDatasetView,
      dispatch.trainingDatasets,
      fsId,
      navigate,
      projectId,
      tdId,
      trainingDataset?.tags,
      userId,
    ],
  );

  const handleDelete = useCallback(async () => {
    handleToggle();
    await dispatch.trainingDatasets.delete({
      projectId: +projectId,
      featureStoreId: +fsId,
      trainingDatasetId: +tdId,
    });

    dispatch.trainingDatasets.fetch({
      projectId: +projectId,
      featureStoreId: +fsId,
    });
    navigate('/td', 'p/:id/fs/:fsId/*');
  }, [dispatch, projectId, navigate, fsId, tdId, handleToggle]);

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
