import React from 'react';

export const ProjectView = React.lazy(() => import('./view/ProjectView'));
export const ProjectEdit = React.lazy(() => import('./edit/ProjectEdit'));
export const FeatureGroupList = React.lazy(
  () => import('./feature-group/list/FeatureGroupList'),
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
  () => import('./feature-group/FeatureGroupDataCorrelation'),
);
export const FeatureGroupStatistics = React.lazy(
  () => import('./feature-group/data/FeatureGroupStatistics'),
);
export const StorageConnectorsList = React.lazy(
  () => import('./storage-connectors/list/StorageConnectorsList'),
);
export const StorageConnectorsCreate = React.lazy(
  () => import('./storage-connectors/create/StorageConnectorsCreate'),
);
export const StorageConnectorsEdit = React.lazy(
  () => import('./storage-connectors/edit/StorageConnectorsEdit'),
);
export const StorageConnectorsImportSample = React.lazy(
  () => import('./storage-connectors/import-sample/StorageConnectorsImportSample'),
);
export const FeatureGroupOverview = React.lazy(
  () => import('./feature-group/overview/FeatureGroupOverview'),
);
export const TrainingDatasetList = React.lazy(
  () => import('./training-dataset/list/TrainingDatasetList'),
);
export const TrainingDatasetOverview = React.lazy(
  () => import('./training-dataset/overview/TrainingDatasetOverview'),
);
export const TrainingDatasetStatistics = React.lazy(
  () => import('./training-dataset/data/TrainingDatasetStatistics'),
);
export const TrainingDatasetCreate = React.lazy(
  () => import('./training-dataset/create/TrainingDatasetCreate'),
);
export const TrainingDatasetEdit = React.lazy(
  () => import('./training-dataset/edit/TrainingDatasetEdit'),
);

export const ProjectCode = React.lazy(() => import('./integrations/Code'));
export const ProjectDatabricks = React.lazy(
  () => import('./integrations/Databricks'),
);
export const ProjectSpark = React.lazy(
  () => import('./integrations/spark/Spark'),
);
