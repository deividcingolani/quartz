// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo } from 'react';
import { Route, Routes } from 'react-router-dom';

import Redirect from '../../components/redirect/Redirect';

import routeNames from '../../routes/routeNames';

import {
  FeaturesDeepSearch,
  FeatureGroupsDeepSearch,
  TrainingDatasetsDeepSearch,
} from './lazyComponents';
import getHrefNoMatching from '../../utils/getHrefNoMatching';

const DeepSearch: FC = () => {
  return (
    <Routes>
      <Route
        path={routeNames.search.searchOneProjectFeatures}
        element={<FeaturesDeepSearch />}
      />
      <Route
        path={routeNames.search.searchAllProjectsFeatures}
        element={<FeaturesDeepSearch />}
      />
      <Route
        path={routeNames.search.searchOneProjectFeaturesWithoutSearch}
        element={<FeaturesDeepSearch />}
      />
      <Route
        path={routeNames.search.searchAllProjectsFeaturesWithoutSearch}
        element={<FeaturesDeepSearch />}
      />
      <Route
        path={routeNames.search.searchOneProjectFeatureGroups}
        element={<FeatureGroupsDeepSearch />}
      />
      <Route
        path={routeNames.search.searchAllProjectsFeatureGroups}
        element={<FeatureGroupsDeepSearch />}
      />
      <Route
        path={routeNames.search.searchOneProjectFeatureGroupsWithoutSearch}
        element={<FeatureGroupsDeepSearch />}
      />
      <Route
        path={routeNames.search.searchAllProjectsFeatureGroupsWithoutSearch}
        element={<FeatureGroupsDeepSearch />}
      />
      <Route
        path={routeNames.search.searchOneProjectTrainingDatasets}
        element={<TrainingDatasetsDeepSearch />}
      />
      <Route
        path={routeNames.search.searchAllProjectsTrainingDatasets}
        element={<TrainingDatasetsDeepSearch />}
      />
      <Route
        path={routeNames.search.searchOneProjectTrainingDatasetsWithoutSearch}
        element={<TrainingDatasetsDeepSearch />}
      />
      <Route
        path={routeNames.search.searchAllProjectsTrainingDatasetsWithoutSearch}
        element={<TrainingDatasetsDeepSearch />}
      />
      <Route
        path="*"
        element={
          <Redirect
            to={getHrefNoMatching(
              routeNames.search.searchAllProjectsFeatureGroupsWithoutSearch,
              routeNames.search.value,
              true,
            )}
          />
        }
      />
    </Routes>
  );
};

export default memo(DeepSearch);
