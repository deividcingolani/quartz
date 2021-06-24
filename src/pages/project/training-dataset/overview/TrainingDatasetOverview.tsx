// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo, useCallback, useEffect } from 'react';
import { Subtitle } from '@logicalclocks/quartz';
import { useParams } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import routeNames from '../../../../routes/routeNames';
import useTrainingDatasetView from '../hooks/useTrainingDatasetView';

import Loader from '../../../../components/loader/Loader';
import { TrainingDataset } from '../../../../types/training-dataset';
import TrainingDatasetOverviewContent from './TrainingDatasetOverviewContent';
import useTitle from '../../../../hooks/useTitle';
import { Dispatch } from '../../../../store';

const TrainingDatasetOverview: FC = () => {
  const { tdId, id: projectId } = useParams();

  const { data, isLoading, fetchData } = useTrainingDatasetView(
    +projectId,
    +tdId,
  );

  const dispatch = useDispatch<Dispatch>();

  const navigate = useNavigateRelative();

  const handleNavigate = useCallback(
    (id: number, route: string) => (): void => {
      navigate(route.replace(':tdId', String(id)), routeNames.project.view);
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
    <TrainingDatasetOverviewContent
      data={data as TrainingDataset}
      onClickEdit={handleNavigate(+tdId, routeNames.trainingDataset.edit)}
      onClickRefresh={fetchData}
    />
  );
};

export default memo(TrainingDatasetOverview);
