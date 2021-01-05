import React from 'react';

export const FeaturesDeepSearch = React.lazy(
  () => import('./features/FeaturesDeepSearch'),
);
export const FeatureGroupsDeepSearch = React.lazy(
  () => import('./feature-groups/FeatureGroupsDeepSearch'),
);
export const TrainingDatasetsDeepSearch = React.lazy(
  () => import('./training-datasets/TrainingDatasetsDeepSearch'),
);
