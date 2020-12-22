import { useDispatch, useSelector } from 'react-redux';
import React, { FC, memo, useCallback, useEffect } from 'react';
import { Route, Routes, useLocation, useParams } from 'react-router-dom';

import routeNames from '../../routes/routeNames';
// Components
import Loader from '../../components/loader/Loader';
import Redirect from '../../components/redirect/Redirect';
import Error404 from '../error/404Error';
// Types
import { Dispatch, RootState } from '../../store';

import {
  FeatureGroupList,
  FeatureGroupEdit,
  FeatureGroupCreate,
  FeatureGroupActivity,
  FeatureGroupDataPreview,
  FeatureGroupDataCorrelation,
  FeatureGroupStatistics,
  SourcesList,
  SourcesCreate,
  SourcesEdit,
  SourcesImportSample,
  FeatureGroupOverview,
  TrainingDatasetList,
  ProjectView,
  ProjectEdit,
  TrainingDatasetOverview,
  TrainingDatasetStatistics,
} from './lazyComponents';

const Project: FC = () => {
  const { id } = useParams();
  const location = useLocation();

  const featureStoreData = useSelector((state: RootState) =>
    state.featureStores?.length ? state.featureStores[0] : null,
  );
  const isFSLoading = useSelector(
    (state: RootState) => state.loading.effects.featureStores.fetch,
  );

  const dispatch = useDispatch<Dispatch>();

  const clearData = useCallback((): void => {
    dispatch.featureGroups.setFeatureGroups([]);
    dispatch.trainingDatasets.set([]);
    dispatch.featureStoreSources.clear();
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
      <Route path={'/view'} element={<ProjectView />} />
      <Route path={'/edit'} element={<ProjectEdit />} />
      <Route
        path={routeNames.featureGroup.edit}
        element={<FeatureGroupEdit />}
      />
      <Route
        path={routeNames.featureGroup.list}
        element={<FeatureGroupList />}
      />
      <Route
        path={routeNames.featureGroup.create}
        element={<FeatureGroupCreate />}
      />
      <Route
        path={routeNames.featureGroup.activity}
        element={<FeatureGroupActivity />}
      />
      <Route
        path={routeNames.featureGroup.preview}
        element={<FeatureGroupDataPreview />}
      />
      <Route
        path={routeNames.featureGroup.previewOne}
        element={<FeatureGroupDataPreview />}
      />
      <Route
        path={routeNames.featureGroup.overview}
        element={<FeatureGroupOverview />}
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
        path={routeNames.featureGroup.statisticsViewCommit}
        element={<FeatureGroupStatistics />}
      />
      <Route
        path={routeNames.featureGroup.statisticsViewCommitAndOne}
        element={<FeatureGroupStatistics />}
      />
      <Route
        path={routeNames.featureGroup.statisticsViewCommit}
        element={<FeatureGroupStatistics />}
      />
      <Route
        path={routeNames.featureGroup.statisticsViewCommitAndOne}
        element={<FeatureGroupStatistics />}
      />
      <Route
        path={routeNames.featureGroup.correlation}
        element={<FeatureGroupDataCorrelation />}
      />

      <Route
        path={routeNames.trainingDataset.list}
        element={<TrainingDatasetList />}
      />
      <Route
        path={routeNames.trainingDataset.overview}
        element={<TrainingDatasetOverview />}
      />
      <Route
        path={routeNames.trainingDataset.statistics}
        element={<TrainingDatasetStatistics />}
      />
      <Route
        path={routeNames.trainingDataset.statisticsViewOne}
        element={<TrainingDatasetStatistics />}
      />
      <Route
        path={routeNames.trainingDataset.statisticsViewCommit}
        element={<TrainingDatasetStatistics />}
      />

      <Route
        path={routeNames.trainingDataset.statisticsViewCommitAndOne}
        element={<TrainingDatasetStatistics />}
      />

      <Route path={routeNames.source.list} element={<SourcesList />} />
      <Route path={routeNames.source.create} element={<SourcesCreate />} />
      <Route path={routeNames.source.edit} element={<SourcesEdit />} />
      <Route
        path={routeNames.source.importSample}
        element={<SourcesImportSample />}
      />
      <Route
        path={routeNames.source.createWithProtocol}
        element={<SourcesCreate />}
      />
      <Route path="/" element={<Redirect to={`${location.pathname}/view`} />} />
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
};

export default memo(Project);
