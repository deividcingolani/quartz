import React, { FC, memo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

// Types
import { Dispatch, RootState } from '../../../../store';
import { FeatureGroupFormData } from '../types';
// Components
import FeatureGroupForm from '../forms/FeatureGroupForm';
// Hooks
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
// Utils
import { mapFeatures, getEnabledStatistics } from '../utils';
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
      dispatch.featureGroupLabels.fetch({
        projectId: +projectId,
      });
    }

    return () => {
      dispatch.featureGroupView.clear();
    };
  }, [dispatch, projectId, featureStoreData]);

  const handleSubmit = useCallback(
    async (data: FeatureGroupFormData) => {
      const { features, enabled, histograms, correlations, ...restData } = data;

      if (featureStoreData?.featurestoreId) {
        const id = await dispatch.featureGroups.create({
          projectId: +projectId,
          featureStoreId: featureStoreData?.featurestoreId,
          data: {
            ...restData,
            features: mapFeatures(features),
            statisticColumns: getEnabledStatistics(features),
            type: 'cachedFeaturegroupDTO',
            timeTravelFormat: restData.timeTravelFormat[0].toUpperCase(),
            descStatsEnabled: !!getEnabledStatistics(features).length,
            validationType: restData.validationType[0].toUpperCase(),
            jobs: [],
            version: 1,
            statisticsConfig: {
              columns: [],
              correlations,
              enabled,
              histograms,
            },
          },
        });

        if (id) {
          dispatch.featureGroups.fetch({
            projectId: +projectId,
            featureStoreId: featureStoreData?.featurestoreId,
          });

          navigate(`/fg/${id}`, 'p/:id/*');
        }
      }
    },
    [dispatch, featureStoreData, navigate, projectId],
  );

  const isFeatureStoreLoading = useSelector(
    (state: RootState) => state.loading.effects.featureStores.fetch,
  );

  const isSubmit = useSelector(
    (state: RootState) => state.loading.effects.featureGroups.create,
  );

  return (
    <FeatureGroupForm
      isLoading={isFeatureStoreLoading}
      isDisabled={isSubmit}
      submitHandler={handleSubmit}
    />
  );
};

export default memo(FeatureGroupCreate);
