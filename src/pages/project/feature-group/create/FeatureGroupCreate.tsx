import React, { FC, memo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

// Types
import { Dispatch, RootState } from '../../../../store';
import { FeatureGroupFormData } from '../types';
// Components
import Loader from '../../../../components/loader/Loader';
import FeatureGroupForm from '../forms/FeatureGroupForm';
// Hooks
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
// Utils
import {
  mapFeatures,
  getEnabledStatistics,
  mapStatisticConfiguration,
} from '../utils';
import useTitle from '../../../../hooks/useTitle';
import titles from '../../../../sources/titles';

const FeatureGroupCreate: FC = () => {
  useTitle(titles.createFeatureGroup);

  const { id: projectId } = useParams();

  const dispatch = useDispatch<Dispatch>();

  const navigate = useNavigateRelative();

  const featureStoreData = useSelector((state: RootState) =>
    state.featureStores?.length ? state.featureStores[0] : null,
  );

  useEffect(() => {
    if (featureStoreData?.featurestoreId) {
      dispatch.schematisedTags.fetch();
      dispatch.featureGroups.fetch({
        projectId: +projectId,
        featureStoreId: featureStoreData.featurestoreId,
      });
      dispatch.featureStoreSources.fetch({
        projectId: +projectId,
        featureStoreId: featureStoreData?.featurestoreId,
      });
      dispatch.featureGroupLabels.fetch({
        projectId: +projectId,
      });
    }
  }, [dispatch, projectId, featureStoreData]);

  const handleSubmit = useCallback(
    async (data: FeatureGroupFormData) => {
      const { features, statisticConfiguration, ...restData } = data;

      if (featureStoreData?.featurestoreId) {
        await dispatch.featureGroups.create({
          projectId: +projectId,
          featureStoreId: featureStoreData?.featurestoreId,
          data: {
            ...restData,
            features: mapFeatures(features),
            ...mapStatisticConfiguration(statisticConfiguration),
            statisticColumns: getEnabledStatistics(features),
            type: 'cachedFeaturegroupDTO',
            timeTravelFormat: restData.timeTravelFormat[0].toUpperCase(),
            descStatsEnabled: !!getEnabledStatistics(features).length,
            jobs: [],
            version: 1,
          },
        });
      }

      dispatch.featureGroups.clear();

      navigate('/fg', 'p/:id/*');
    },
    [dispatch, featureStoreData, navigate, projectId],
  );

  const isFeatureStoreLoading = useSelector(
    (state: RootState) => state.loading.effects.featureStores.fetch,
  );

  const isKeywordsLoading = useSelector(
    (state: RootState) => state.loading.effects.featureGroups.fetch,
  );

  const isTagsLoading = useSelector(
    (state: RootState) => state.loading.effects.schematisedTags.fetch,
  );

  const isSubmit = useSelector(
    (state: RootState) => state.loading.effects.featureGroups.create,
  );

  if (isKeywordsLoading || isTagsLoading) {
    return <Loader />;
  }

  return (
    <FeatureGroupForm
      isLoading={isFeatureStoreLoading}
      isDisabled={isSubmit}
      submitHandler={handleSubmit}
    />
  );
};

export default memo(FeatureGroupCreate);
