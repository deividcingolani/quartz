import React, { FC, memo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

// Types
import { Dispatch, RootState } from '../../../../store';
import { FeatureGroupFormData } from '../types';
// Components
import Loader from '../../../../components/loader/Loader';
import FeatureGroupForm from '../forms/FeatureGroupForm';
// Selectors
import { selectFeatureStoreSourcesLoading } from '../../../../store/models/feature/sources/selectors';
// Hooks
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
// Utils
import {
  mapFeatures,
  getEnabledStatistics,
  mapStatisticConfiguration,
} from '../utils';
import { TinyPopup, usePopup } from '@logicalclocks/quartz';

const FeatureGroupEdit: FC = () => {
  const { id: projectId, fgId } = useParams();

  const dispatch = useDispatch<Dispatch>();

  const navigate = useNavigateRelative();

  const [isPopupOpen, handleToggle] = usePopup();

  const featureStoreData = useSelector((state: RootState) =>
    state.featureStores?.length ? state.featureStores[0] : null,
  );

  useEffect(() => {
    if (featureStoreData?.featurestoreId) {
      dispatch.featureGroups.fetch({
        projectId: +projectId,
        featureStoreId: featureStoreData.featurestoreId,
      });
      dispatch.featureStoreSources.fetch({
        projectId: +projectId,
        featureStoreId: featureStoreData?.featurestoreId,
      });
    }
    return () => {
      dispatch.featureGroups.clear();
    };
  }, [dispatch, projectId, featureStoreData]);

  const isSubmit = useSelector(
    (state: RootState) => state.loading.effects.featureGroups.edit,
  );

  const isDeleting = useSelector(
    (state: RootState) => state.loading.effects.featureGroups.delete,
  );

  const featureGroup = useSelector((state: RootState) =>
    state.featureGroups.find((f) => f.id === +fgId),
  );

  const handleSubmit = useCallback(
    async (data: FeatureGroupFormData) => {
      const {
        features,
        description,
        statisticConfiguration,
        onlineEnabled,
        labels,
      } = data;

      if (featureStoreData?.featurestoreId) {
        await dispatch.featureGroups.edit({
          projectId: +projectId,
          featureStoreId: featureStoreData?.featurestoreId,
          featureGroupId: +fgId,
          data: {
            description,
            labels,
            type: 'cachedFeaturegroupDTO',
            features: mapFeatures(features),
            ...mapStatisticConfiguration(statisticConfiguration),
            statisticColumns: getEnabledStatistics(features),
            descStatsEnabled: !!getEnabledStatistics(features).length,
            onlineEnabled,
          },
        });
      }

      dispatch.featureGroups.clear();

      navigate('/fg', 'p/:id/*');
    },
    [dispatch, featureStoreData, navigate, projectId, fgId],
  );

  const handleDelete = useCallback(async () => {
    if (featureStoreData?.featurestoreId) {
      handleToggle();
      await dispatch.featureGroups.delete({
        projectId: +projectId,
        featureStoreId: featureStoreData?.featurestoreId,
        featureGroupId: +fgId,
      });

      dispatch.featureGroups.clear();

      navigate('/fg', 'p/:id/*');
    }
  }, [dispatch, featureStoreData, projectId, navigate, fgId, handleToggle]);

  const isFeatureStoreLoading = useSelector(
    (state: RootState) => state.loading.effects.featureStores.fetch,
  );

  const isLabelsLoading = useSelector(
    (state: RootState) => state.loading.effects.featureGroups.fetch,
  );

  const isSourcesLoading = useSelector(selectFeatureStoreSourcesLoading);

  if (isLabelsLoading || isSourcesLoading || !featureGroup) {
    return <Loader />;
  }

  return (
    <>
      <FeatureGroupForm
        isEdit={true}
        isLoading={isLabelsLoading || isFeatureStoreLoading || isDeleting}
        isDisabled={isSubmit}
        submitHandler={handleSubmit}
        onDelete={handleToggle}
        initialData={featureGroup}
      />
      <TinyPopup
        width="440px"
        title={`Delete ${featureGroup.name}`}
        secondaryText="Once you delete a feature group, there is no going back. Please be certain."
        isOpen={isPopupOpen}
        mainButton={['Delete feature group', handleDelete]}
        secondaryButton={['Back', handleToggle]}
        onClose={handleToggle}
      />
    </>
  );
};

export default memo(FeatureGroupEdit);
