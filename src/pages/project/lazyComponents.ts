import React from 'react';

export const ProjectView = React.lazy(() => import('./view/ProjectView'));
export const Settings = React.lazy(() => import('./settings/Settings'));
export const ProjectEdit = React.lazy(() => import('./edit/ProjectEdit'));
export const MultiStoreFGList = React.lazy(
  () => import('./feature-group/list/MultiStoreFGList'),
);
export const FeatureGroupEdit = React.lazy(
  () => import('./feature-group/edit/FeatureGroupEdit'),
);
export const FeatureGroupCreate = React.lazy(
  () => import('./feature-group/create/FeatureGroupCreate'),
);
export const FeatureGroupActivity = React.lazy(
  () => import('./feature-group/activity/FeatureGroupActivity'),
);
export const FeatureGroupDataPreview = React.lazy(
  () => import('./feature-group/data/data-preview/FeatureGroupDataPreview'),
);
export const FeatureGroupDataCorrelation = React.lazy(
  () => import('./feature-group/data/correlation/FeatureGroupCorrelation'),
);
export const FeatureGroupStatistics = React.lazy(
  () => import('./feature-group/data/FeatureGroupStatistics'),
);
export const MultiStoreSCList = React.lazy(
  () => import('./storage-connectors/list/MultiStoreSCList'),
);
export const StorageConnectorsCreate = React.lazy(
  () => import('./storage-connectors/create/StorageConnectorsCreate'),
);
export const StorageConnectorsEdit = React.lazy(
  () => import('./storage-connectors/edit/StorageConnectorsEdit'),
);
export const StorageConnectorsImportSample = React.lazy(
  () =>
    import('./storage-connectors/import-sample/StorageConnectorsImportSample'),
);
export const FeatureGroupOverview = React.lazy(
  () => import('./feature-group/overview/FeatureGroupOverview'),
);
export const MultiStoreTDList = React.lazy(
  () => import('./training-dataset/list/MultiStoreTDList'),
);
export const TrainingDatasetOverview = React.lazy(
  () => import('./training-dataset/overview/TrainingDatasetOverview'),
);
export const TrainingDatasetStatistics = React.lazy(
  () => import('./training-dataset/data/TrainingDatasetStatistics'),
);
export const TrainingDatasetCorrelation = React.lazy(
  () => import('./training-dataset/data/TrainingDatasetCorrelation'),
);
export const TrainingDatasetCreate = React.lazy(
  () => import('./training-dataset/create/TrainingDatasetCreate'),
);
export const TrainingDatasetEdit = React.lazy(
  () => import('./training-dataset/edit/TrainingDatasetEdit'),
);
export const JobsList = React.lazy(() => import('./jobs/list/JobsList'));
export const JobsOverview = React.lazy(
  () => import('./jobs/overview/JobsOverview'),
);
export const JobsCreate = React.lazy(() => import('./jobs/create/JobsCreate'));
export const JobsEdit = React.lazy(() => import('./jobs/edit/JobsEdit'));
export const JobsExecutions = React.lazy(
  () => import('./jobs/executions/JobsExecutions'),
);

export const TrainingDatasetActivity = React.lazy(
  () => import('./training-dataset/activity/TrainingDatasetActivity'),
);

export const ProjectCode = React.lazy(() => import('./integrations/Code'));
export const ProjectDatabricks = React.lazy(
  () => import('./integrations/Databricks'),
);
export const ProjectSpark = React.lazy(
  () => import('./integrations/spark/Spark'),
);

export const ExpectationAttach = React.lazy(
  () => import('../expectation/CreateExpectation'),
);
export const ExpectationEdit = React.lazy(
  () => import('../expectation/EditExpectation'),
);
