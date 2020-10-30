import { Subtitle } from '@logicalclocks/quartz';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { FC, memo, useCallback, useEffect } from 'react';

import routeNames from '../../../../routes/routeNames';

import OverviewContent from './OverviewContent';
// Components
import Loader from '../../../../components/loader/Loader';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
// Types
import {
  FeatureGroup,
  FeatureGroupLabel,
} from '../../../../types/feature-group';
import { Dispatch, RootState } from '../../../../store';
import { FeatureGroupViewState } from '../../../../store/models/feature/featureGroupView.model';
// Selectors
import {
  selectLabels,
  selectLabelsLoading,
  selectFeatureStoreData,
} from '../../../../store/models/feature/selectors';

export interface FeatureGroupOverviewProps {
  projectId: number;
}

const FeatureGroupOverview: FC<FeatureGroupOverviewProps> = ({ projectId }) => {
  const { fgId } = useParams();

  const { data: featureStoreData } = useSelector(selectFeatureStoreData);
  const isLoading = useSelector(
    (state: RootState) => state.loading.effects.featureGroupView.fetch,
  );
  const isLabelsLoading = useSelector(selectLabelsLoading);
  const data = useSelector<RootState, FeatureGroupViewState>(
    (state) => state.featureGroupView,
  );
  const labels = useSelector<RootState, FeatureGroupLabel[]>(
    selectLabels(data?.id),
  );

  const dispatch = useDispatch<Dispatch>();

  const navigate = useNavigateRelative();

  const handleNavigate = useCallback(
    (id: number, route: string) => (): void => {
      navigate(route.replace(':fgId', String(id)), routeNames.project.view);
    },
    [navigate],
  );

  const fetchData = useCallback(() => {
    if (featureStoreData?.featurestoreId && !isLoading) {
      dispatch.featureGroupView.fetch({
        projectId,
        featureStoreId: featureStoreData.featurestoreId,
        featureGroupId: +fgId,
      });
    }
  }, [dispatch, fgId, isLoading, featureStoreData, projectId]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () => () => {
      dispatch.featureGroupView.clear();
    },
    [dispatch],
  );

  if (isLoading) {
    return <Loader />;
  }

  if (!data) {
    return <Subtitle>No data</Subtitle>;
  }

  return (
    <OverviewContent
      data={data as FeatureGroup}
      isLabelsLoading={isLabelsLoading}
      labels={labels}
      onClickEdit={handleNavigate(+fgId, routeNames.featureGroup.edit)}
      onClickRefresh={fetchData}
    />
  );
};

export default memo(FeatureGroupOverview);
