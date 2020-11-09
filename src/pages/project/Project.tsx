import { useDispatch, useSelector } from 'react-redux';
import React, { FC, memo, useCallback, useEffect } from 'react';
import { Route, Routes, useLocation, useParams } from 'react-router-dom';

import routeNames from '../../routes/routeNames';
// Components
import Loader from '../../components/loader/Loader';
import Redirect from '../../components/redirect/Redirect';
// Selectors
import { selectFeatureStoreData } from '../../store/models/feature/selectors';
// Types
import { Dispatch } from '../../store';

// Feature Group
const FeatureGroupList = React.lazy(
  () => import('./feature-group/FeatureGroupList'),
);
const FeatureGroupEdit = React.lazy(
  () => import('./feature-group/FeatureGroupEdit'),
);
const FeatureGroupCreate = React.lazy(
  () => import('./feature-group/FeatureGroupCreate'),
);
const FeatureGroupActivity = React.lazy(
  () => import('./feature-group/FeatureGroupActivity'),
);
const FeatureGroupDataPreview = React.lazy(
  () => import('./feature-group/FeatureGroupDataPreview'),
);
const FeatureGroupDataCorrelation = React.lazy(
  () => import('./feature-group/FeatureGroupDataCorrelation'),
);
const FeatureGroupStatistics = React.lazy(
  () => import('./feature-group/data/FeatureGroupStatistics'),
);
const FeatureGroupOverview = React.lazy(
  () => import('./feature-group/overview/FeatureGroupOverview'),
);
const TrainingDatasetList = React.lazy(
  () => import('./training-dataset/list/TrainingDatasetList'),
);

const Project: FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const { data: featureStoreData, isLoading: isFSLoading } = useSelector(
    selectFeatureStoreData,
  );

  const dispatch = useDispatch<Dispatch>();

  const clearData = useCallback((): void => {
    dispatch.featureGroups.setFeatureGroups([]);
    dispatch.trainingDatasets.clear();
    dispatch.featureStores.setFeatureStores(null);
  }, [dispatch]);

  useEffect(() => {
    clearData();

    dispatch.featureStores.fetch({ projectId: +id });
  }, [dispatch, id, clearData]);

  if (!featureStoreData && isFSLoading) {
    return <Loader />;
  }

  return (
    <Routes>
      <Route
        path={routeNames.featureGroup.edit}
        element={<FeatureGroupEdit />}
      />
      <Route
        path={routeNames.featureGroup.list}
        element={<FeatureGroupList projectId={+id} />}
      />
      <Route
        path={routeNames.featureGroup.create}
        element={<FeatureGroupCreate projectId={+id} />}
      />
      <Route
        path={routeNames.featureGroup.activity}
        element={<FeatureGroupActivity />}
      />
      <Route
        path={routeNames.featureGroup.dataPreview}
        element={<FeatureGroupDataPreview />}
      />
      <Route
        path={routeNames.featureGroup.dataCorrelation}
        element={<FeatureGroupDataCorrelation />}
      />
      <Route
        path={routeNames.featureGroup.overview}
        element={<FeatureGroupOverview projectId={+id} />}
      />
      <Route
        path={routeNames.featureGroup.edit}
        element={<FeatureGroupEdit />}
      />
      <Route
        path={routeNames.featureGroup.list}
        element={<FeatureGroupList projectId={+id} />}
      />
      <Route
        path={routeNames.featureGroup.create}
        element={<FeatureGroupCreate projectId={+id} />}
      />
      <Route
        path={routeNames.featureGroup.activity}
        element={<FeatureGroupActivity />}
      />
      <Route
        path={routeNames.featureGroup.dataPreview}
        element={<FeatureGroupDataPreview />}
      />
      <Route
        path={routeNames.featureGroup.statistics}
        element={<FeatureGroupStatistics />}
      />
      <Route
        path={routeNames.featureGroup.statisticsViewOne}
        element={<FeatureGroupStatistics />}
      />
      <Route
        path={routeNames.featureGroup.dataCorrelation}
        element={<FeatureGroupDataCorrelation />}
      />
      <Route
        path={routeNames.featureGroup.overview}
        element={<FeatureGroupOverview projectId={+id} />}
      />
      <Route
        path={routeNames.trainingDatasetList}
        element={<TrainingDatasetList projectId={+id} />}
      />
      <Route path="/" element={<Redirect to={`${location.pathname}/fg`} />} />
      <Route path="*" element={<div>Page not Found</div>} />
    </Routes>
  );
};

export default memo(Project);
