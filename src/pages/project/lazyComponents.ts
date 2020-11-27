import React from 'react';

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
  () => import('./feature-group/FeatureGroupActivity'),
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
export const SourcesList = React.lazy(
  () => import('./sources/list/SourcesList'),
);
export const SourcesCreate = React.lazy(
  () => import('./sources/create/SourcesCreate'),
);
export const SourcesEdit = React.lazy(
  () => import('./sources/edit/SourceEdit'),
);
export const SourcesImportSample = React.lazy(
  () => import('./sources/import-sample/SourcesImportSample'),
);
export const FeatureGroupOverview = React.lazy(
  () => import('./feature-group/overview/FeatureGroupOverview'),
);
export const TrainingDatasetList = React.lazy(
  () => import('./training-dataset/list/TrainingDatasetList'),
);
