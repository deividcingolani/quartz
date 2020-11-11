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
import FeatureGroupData from './feature-group/data/FeatureGroupData';

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
} from './lazyComponents';

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
        path={routeNames.featureGroup.dataPreview}
        element={<FeatureGroupDataPreview />}
      />
      <Route
        path={routeNames.featureGroup.statistics}
        element={<FeatureGroupData />}
      />
      <Route
        path={routeNames.featureGroup.dataCorrelation}
        element={<FeatureGroupDataCorrelation />}
      />
      <Route
        path={routeNames.featureGroup.overview}
        element={<FeatureGroupOverview />}
      />
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
        element={<FeatureGroupOverview />}
      />
      <Route
        path={routeNames.trainingDatasetList}
        element={<TrainingDatasetList />}
      />
      <Route
        path={routeNames.source.importSample}
        element={<SourcesImportSample />}
      />
      <Route path={routeNames.source.list} element={<SourcesList />} />
      <Route path={routeNames.source.create} element={<SourcesCreate />} />
      <Route path={routeNames.source.edit} element={<SourcesEdit />} />
      <Route
        path={routeNames.source.createWithProtocol}
        element={<SourcesCreate />}
      />
      <Route path="/" element={<Redirect to={`${location.pathname}/fg`} />} />
      <Route path="*" element={<div>Page not Found</div>} />
    </Routes>
  );
};

export default memo(Project);
