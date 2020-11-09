import { Subtitle } from '@logicalclocks/quartz';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import React, { FC, memo, useCallback } from 'react';

import routeNames from '../../../../routes/routeNames';
import useFeatureGroupView from '../hooks/useFeatureGroupView';

import OverviewContent from './OverviewContent';
// Components
import Loader from '../../../../components/loader/Loader';
// Hooks
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
// Types
import {
  FeatureGroup,
  FeatureGroupLabel,
} from '../../../../types/feature-group';
import { RootState } from '../../../../store';
// Selectors
import {
  selectLabels,
  selectLabelsLoading,
} from '../../../../store/models/feature/selectors';

export interface FeatureGroupOverviewProps {
  projectId: number;
}

const FeatureGroupOverview: FC<FeatureGroupOverviewProps> = ({ projectId }) => {
  const { fgId } = useParams();

  const { data, isLoading, fetchData } = useFeatureGroupView(projectId, +fgId);

  const isLabelsLoading = useSelector(selectLabelsLoading);
  const labels = useSelector<RootState, FeatureGroupLabel[]>(
    selectLabels(data?.id),
  );

  const navigate = useNavigateRelative();

  const handleNavigate = useCallback(
    (id: number, route: string) => (): void => {
      navigate(route.replace(':fgId', String(id)), routeNames.project.view);
    },
    [navigate],
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
