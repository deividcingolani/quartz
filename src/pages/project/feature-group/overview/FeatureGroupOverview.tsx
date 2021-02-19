import { Subtitle } from '@logicalclocks/quartz';
import { useParams } from 'react-router-dom';
import React, { FC, memo, useCallback, useEffect } from 'react';

import routeNames from '../../../../routes/routeNames';
import useFeatureGroupView from '../hooks/useFeatureGroupView';

import OverviewContent from './OverviewContent';
// Components
import Loader from '../../../../components/loader/Loader';
// Hooks
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
// Types
import { FeatureGroup } from '../../../../types/feature-group';
import useTitle from '../../../../hooks/useTitle';
import { useDispatch } from 'react-redux';
import { Dispatch } from '../../../../store';

const FeatureGroupOverview: FC = () => {
  const { fgId, id: projectId } = useParams();

  const { data, isLoading, fetchData } = useFeatureGroupView(+projectId, +fgId);

  const navigate = useNavigateRelative();

  const dispatch = useDispatch<Dispatch>();

  const handleNavigate = useCallback(
    (id: number, route: string) => (): void => {
      navigate(route.replace(':fgId', String(id)), routeNames.project.view);
    },
    [navigate],
  );

  useEffect(() => {
    return () => {
      dispatch.featureGroupView.clear();
    };
  }, [dispatch]);

  useTitle(data?.name);

  if (isLoading) {
    return <Loader />;
  }

  if (!data) {
    return <Subtitle>No data</Subtitle>;
  }

  return (
    <OverviewContent
      data={data as FeatureGroup}
      onClickEdit={handleNavigate(+fgId, routeNames.featureGroup.edit)}
      onClickRefresh={fetchData}
    />
  );
};

export default memo(FeatureGroupOverview);
