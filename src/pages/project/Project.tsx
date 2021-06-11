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
  StorageConnectorsList,
  StorageConnectorsCreate,
  StorageConnectorsEdit,
  StorageConnectorsImportSample,
  FeatureGroupOverview,
  TrainingDatasetList,
  ProjectView,
  Settings,
  ProjectEdit,
  TrainingDatasetOverview,
  TrainingDatasetStatistics,
  TrainingDatasetCorrelation,
  TrainingDatasetCreate,
  TrainingDatasetEdit,
  TrainingDatasetActivity,
  JobsList,
  JobsOverview,
  JobsEdit,
  JobsCreate,
  JobsExecutions,
  ProjectCode,
  ProjectDatabricks,
  ProjectSpark,
  ExpectationAttach,
  ExpectationEdit,
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
    dispatch.featureStoreStorageConnectors.clear();
    dispatch.featureStores.setFeatureStores(null);
    dispatch.featureStoreSettings.clear();
  }, [dispatch]);

  useEffect(() => {
    clearData();

    dispatch.featureStores.fetch({ projectId: +id });

    // Fetch settings for the feature store
    dispatch.featureStoreSettings.fetch({ projectId: +id });
  }, [dispatch, id, clearData]);

  if (!featureStoreData && isFSLoading) {
    return <Loader />;
  }

  return (
    <Routes>
      <Route path="/view" element={<ProjectView />} />
      <Route path="/edit" element={<ProjectEdit />} />
      <Route path="/settings" element={<Settings />} />
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
        path={routeNames.featureGroup.activityType}
        element={<FeatureGroupActivity />}
      />
      <Route
        path={routeNames.featureGroup.activityFromAndTo}
        element={<FeatureGroupActivity />}
      />
      <Route
        path={routeNames.featureGroup.activityTypeAndFromAndTo}
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
        path={routeNames.trainingDataset.create}
        element={<TrainingDatasetCreate />}
      />
      <Route
        path={routeNames.trainingDataset.edit}
        element={<TrainingDatasetEdit />}
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
      <Route
        path={routeNames.trainingDataset.correlation}
        element={<TrainingDatasetCorrelation />}
      />
      <Route
        path={routeNames.trainingDataset.activity}
        element={<TrainingDatasetActivity />}
      />
      <Route
        path={routeNames.trainingDataset.activityType}
        element={<FeatureGroupActivity />}
      />
      <Route
        path={routeNames.trainingDataset.activityFromAndTo}
        element={<FeatureGroupActivity />}
      />
      <Route
        path={routeNames.trainingDataset.activityTypeAndFromAndTo}
        element={<FeatureGroupActivity />}
      />

      <Route
        path={routeNames.storageConnector.list}
        element={<StorageConnectorsList />}
      />
      <Route
        path={routeNames.storageConnector.create}
        element={<StorageConnectorsCreate />}
      />
      <Route
        path={routeNames.storageConnector.edit}
        element={<StorageConnectorsEdit />}
      />
      <Route path={routeNames.jobs.list} element={<JobsList />} />
      <Route path={routeNames.jobs.overview} element={<JobsOverview />} />
      <Route path={routeNames.jobs.create} element={<JobsCreate />} />
      <Route path={routeNames.jobs.edit} element={<JobsEdit />} />
      <Route path={routeNames.jobs.executions} element={<JobsExecutions />} />
      <Route
        path={routeNames.jobs.executionsTypeAndFromAndTo}
        element={<JobsExecutions />}
      />
      <Route
        path={routeNames.jobs.executionsFromAndTo}
        element={<JobsExecutions />}
      />
      <Route
        path={routeNames.jobs.executionsType}
        element={<JobsExecutions />}
      />
      <Route
        path={routeNames.jobs.create}
        element={<StorageConnectorsCreate />}
      />
      <Route path={routeNames.jobs.edit} element={<StorageConnectorsEdit />} />
      <Route
        path={routeNames.storageConnector.importSample}
        element={<StorageConnectorsImportSample />}
      />
      <Route
        path={routeNames.storageConnector.createWithProtocol}
        element={<StorageConnectorsCreate />}
      />

      <Route path="/settings/integrations/code" element={<ProjectCode />} />
      <Route path="/settings/integrations/spark" element={<ProjectSpark />} />
      <Route path="/settings/integrations/databricks" element={<ProjectDatabricks />} />

      <Route
        path={routeNames.expectation.attach}
        element={<ExpectationAttach />}
      />
      <Route path={routeNames.expectation.edit} element={<ExpectationEdit />} />
      <Route
        path={routeNames.expectation.editWithFrom}
        element={<ExpectationEdit />}
      />

      <Route path="/" element={<Redirect to={`${location.pathname}/view`} />} />
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
};

export default memo(Project);
