// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

// Types
import { Dispatch, RootState } from '../../../../store';
import { FeatureGroupFormData } from '../types';
// Components
import FeatureGroupForm from '../forms/FeatureGroupForm';
// Utils
import { mapFeatures, getEnabledStatistics } from '../utils';
import useTitle from '../../../../hooks/useTitle';
import titles from '../../../../sources/titles';
import getHrefNoMatching from '../../../../utils/getHrefNoMatching';
import routeNames from '../../../../routes/routeNames';

const FeatureGroupCreate: FC = () => {
  useTitle(titles.createFeatureGroup);

  const { id: projectId, fsId } = useParams();

  const dispatch = useDispatch<Dispatch>();

  const navigate = useNavigate();

  const featureStoreData = useSelector((state: RootState) =>
    state.featureStores?.length ? state.featureStores[0] : null,
  );

  useEffect(() => {
    dispatch.schematisedTags.fetch();
    dispatch.featureGroupLabels.fetch({
      projectId: +projectId,
    });

    return () => {
      dispatch.featureGroupView.clear();
    };
  }, [dispatch, projectId, featureStoreData]);

  const handleSubmit = useCallback(
    async (data: FeatureGroupFormData) => {
      const { features, enabled, histograms, correlations, ...restData } = data;

      const id = await dispatch.featureGroups.create({
        projectId: +projectId,
        featureStoreId: +fsId,
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
          featureStoreId: +fsId,
        });

        navigate(
          getHrefNoMatching(
            routeNames.featureGroup.overview,
            routeNames.project.value,
            true,
            { fgId: id, fsId, id: projectId },
          ),
        );
      }
    },
    [dispatch, fsId, navigate, projectId],
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
