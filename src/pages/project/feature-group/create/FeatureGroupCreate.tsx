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

const FeatureGroupCreate: FC = () => {
  const { id: projectId } = useParams();

  const dispatch = useDispatch<Dispatch>();

  const navigate = useNavigateRelative();

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
  }, [dispatch, projectId, featureStoreData]);

  const isSubmit = useSelector(
    (state: RootState) => state.loading.effects.featureGroups.create,
  );

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

  const isLabelsLoading = useSelector(
    (state: RootState) => state.loading.effects.featureGroups.fetch,
  );

  const isSourcesLoading = useSelector(selectFeatureStoreSourcesLoading);

  if (isLabelsLoading || isSourcesLoading) {
    return <Loader />;
  }

  return (
    <FeatureGroupForm
      isLoading={isLabelsLoading || isFeatureStoreLoading}
      isDisabled={isSubmit}
      submitHandler={handleSubmit}
    />
  );
};

export default memo(FeatureGroupCreate);
