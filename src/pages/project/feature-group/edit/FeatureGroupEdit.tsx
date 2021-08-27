// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

// Types
import { TinyPopup, usePopup } from '@logicalclocks/quartz';
import { Dispatch, RootState } from '../../../../store';
import { FeatureGroupFormData } from '../types';
// Components
import Loader from '../../../../components/loader/Loader';
import FeatureGroupForm from '../forms/FeatureGroupForm';
// Utils
import { mapFeatures, getEnabledStatistics } from '../utils';
import { FeatureGroupViewState } from '../../../../store/models/feature/featureGroupView.model';
import useTitle from '../../../../hooks/useTitle';
import titles from '../../../../sources/titles';
import getHrefNoMatching from '../../../../utils/getHrefNoMatching';
import routeNames from '../../../../routes/routeNames';

const FeatureGroupEdit: FC = () => {
  const { id: projectId, fsId, fgId } = useParams();

  const dispatch = useDispatch<Dispatch>();

  const navigate = useNavigate();

  const [isPopupOpen, handleToggle] = usePopup();

  const featureStoreData = useSelector((state: RootState) =>
    state.featureStores?.length ? state.featureStores[0] : null,
  );

  useEffect(() => {
    dispatch.featureGroupView.fetch({
      projectId: +projectId,
      featureStoreId: +fsId,
      featureGroupId: +fgId,
    });
    dispatch.schematisedTags.fetch();
    dispatch.featureGroupLabels.fetch({
      projectId: +projectId,
    });

    return () => {
      dispatch.featureGroupView.clear();
    };
  }, [dispatch, projectId, featureStoreData, fsId, fgId]);

  const featureGroup = useSelector<RootState, FeatureGroupViewState>(
    (state) => state.featureGroupView,
  );

  const handleSubmit = useCallback(
    async (data: FeatureGroupFormData) => {
      const {
        features,
        description,
        enabled,
        histograms,
        correlations,
        onlineEnabled,
        tags,
        keywords,
        validationType,
      } = data;

      await dispatch.featureGroups.edit({
        projectId: +projectId,
        featureStoreId: +fsId,
        featureGroupId: +fgId,
        data: {
          description,
          keywords,
          type: 'cachedFeaturegroupDTO',
          features: mapFeatures(features),
          onlineEnabled,
          tags,
          validationType: validationType[0],
          prevTags: featureGroup?.tags.map(({ name }) => name),
          statisticsConfig: {
            columns: getEnabledStatistics(features),
            correlations,
            enabled,
            histograms,
          },
        },
      });

      dispatch.featureGroupView.clear();
      dispatch.featureGroups.fetch({
        projectId: +projectId,
        featureStoreId: +fsId,
      });

      navigate(
        getHrefNoMatching(
          routeNames.featureGroup.overview,
          routeNames.project.value,
          true,
          { id: projectId, fsId, fgId },
        ),
      );
    },
    [dispatch, fsId, navigate, projectId, fgId, featureGroup],
  );

  const handleDelete = useCallback(async () => {
    handleToggle();
    await dispatch.featureGroups.delete({
      projectId: +projectId,
      featureStoreId: +fsId,
      featureGroupId: +fgId,
    });

    dispatch.featureGroups.fetch({
      projectId: +projectId,
      featureStoreId: +fsId,
    });

    navigate(
      getHrefNoMatching(
        routeNames.featureGroup.list,
        routeNames.project.value,
        true,
        { id: projectId, fsId },
      ),
    );
  }, [dispatch, fsId, projectId, navigate, fgId, handleToggle]);

  const isFeatureStoreLoading = useSelector(
    (state: RootState) => state.loading.effects.featureStores.fetch,
  );

  const isDeleting = useSelector(
    (state: RootState) => state.loading.effects.featureGroups.delete,
  );

  const isSubmit = useSelector(
    (state: RootState) => state.loading.effects.featureGroups.edit,
  );

  useTitle(`${titles.editFg} - ${featureGroup?.name}`);

  if (!featureGroup) {
    return <Loader />;
  }

  return (
    <>
      <FeatureGroupForm
        isEdit={true}
        isLoading={isSubmit || isDeleting || isFeatureStoreLoading}
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
