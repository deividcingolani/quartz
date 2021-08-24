// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useLocation, useParams } from 'react-router-dom';

import routeNames from '../../routes/routeNames';
// Components
import Loader from '../../components/loader/Loader';
import Error404 from '../error/404Error';
// Types
import { Dispatch, RootState } from '../../store';

import {
  MultiStoreFGList,
  FeatureGroupEdit,
  FeatureGroupCreate,
  FeatureGroupActivity,
  FeatureGroupDataPreview,
  FeatureGroupDataCorrelation,
  FeatureGroupStatistics,
  MultiStoreSCList,
  StorageConnectorsCreate,
  StorageConnectorsEdit,
  StorageConnectorsImportSample,
  FeatureGroupOverview,
  MultiStoreTDList,
  ProjectView,
  GeneralSettings,
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
  ExpectationAttach,
  ExpectationEdit,
  JupyterOverview,
  JupyterSettings,
} from './lazyComponents';
import Integrations from './settings/Integrations';
import Python from './settings/Python';
import Alerts from './settings/Alerts';
import Redirect from '../../components/redirect/Redirect';

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
    dispatch.multistore.clear();
    dispatch.project.clear();
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
      <Route
        path={routeNames.project.settings.settings}
        element={<Redirect to={routeNames.project.settings.general} />}
      />
      <Route
        path={routeNames.project.settings.general}
        element={<GeneralSettings />}
      />
      <Route path={routeNames.project.settings.python} element={<Python />} />
      <Route path={routeNames.project.settings.alert} element={<Alerts />} />
      <Route
        path={routeNames.project.settings.integrations}
        element={<Integrations />}
      />
      <Route
        path={routeNames.featureGroup.edit}
        element={<FeatureGroupEdit />}
      />
      <Route
        path={routeNames.featureGroup.list}
        element={<MultiStoreFGList />}
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
        element={<MultiStoreTDList />}
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
        path={routeNames.trainingDataset.statisticsViewCommitSplit}
        element={<TrainingDatasetStatistics />}
      />
      <Route
        path={routeNames.trainingDataset.statisticsViewCommitSplitAndOne}
        element={<TrainingDatasetStatistics />}
      />
      <Route
        path={routeNames.trainingDataset.correlation}
        element={<TrainingDatasetCorrelation />}
      />
      <Route
        path={routeNames.trainingDataset.correlationViewCommit}
        element={<TrainingDatasetCorrelation />}
      />
      <Route
        path={routeNames.trainingDataset.correlationViewCommitSplit}
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
        element={<MultiStoreSCList />}
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
      <Route path={routeNames.jupyter.overview} element={<JupyterOverview />} />
      <Route path={routeNames.jupyter.settings} element={<JupyterSettings />} />

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
