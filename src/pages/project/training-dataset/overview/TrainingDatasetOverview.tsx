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
import useProvenance from '../../../../hooks/useProvenance';

const TrainingDatasetOverview: FC = () => {
  const { tdId, fsId, id: projectId } = useParams();

  const { data, isLoading, fetchData } = useTrainingDatasetView(
    +projectId,
    +tdId,
  );

  const { provenance } = useProvenance({
    projectId: +projectId,
    featureStoreId: +fsId,
    data,
  });

  const dispatch = useDispatch<Dispatch>();

  const navigate = useNavigateRelative();

  const handleNavigate = useCallback(
    (id: number, route: string) => (): void => {
      navigate(
        route.replace(':fsId', fsId).replace(':tdId', String(id)),
        routeNames.project.view,
      );
    },
    [fsId, navigate],
  );

  useEffect(() => {
    return () => {
      dispatch.trainingDatasetView.clear();
      dispatch.provenance.clear();
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
      data={{ ...data, provenance } as TrainingDataset}
      onClickEdit={handleNavigate(+tdId, routeNames.trainingDataset.edit)}
      onClickRefresh={fetchData}
    />
  );
};

export default memo(TrainingDatasetOverview);
