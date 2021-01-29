import { Models } from '@rematch/core';

// Models
import api from './api/api.model';
import auth from './auth/auth.model';
import scope from './scope/scope.model';
import search from './search/search.model';
import profile from './profile/profile.model';
import project from './projects/project.model';
import dataset from './dataset/dataset.model';
import deepSearch from './search/deep-search.model';
import store from './localManagement/store.model';
import basket from './localManagement/basket.model';
import projectsList from './projects/projectsList.model';
import featureGroups from './feature/featureGroups.model';
import { trainingDatasetModel } from './training-dataset';
import featureStores from './feature/featureStores.model';
import roleMappings from './role-mappings/role-mappings.model';
import featureGroupView from './feature/featureGroupView.model';
import featureGroupLabels from './feature/featureGroupLabels.model';
import { trainingDatasetLabelModel } from './training-dataset-label';
import featureGroupRows from './feature/statistics/featureGroupRows.model';
import featureStoreSources from './feature/sources/featureStoreSources.model';
import trainingDatasetView from './training-dataset/trainingDatasetView.model';
import featureGroupDataPreview from './feature/data/featureGroupsDataPreview.model';
import featureGroupStatistics from './feature/statistics/featureGroupStatistics.model';
import featureGroupCommitsDetail from './feature/statistics/featureGroupCommitsDetail.model';
import featureGroupStatisticsCommits from './feature/statistics/featureGroupStatisticsCommits.model';
import trainingDatasetQuery from './training-dataset/trainingDatasetQuery.model';
import schematisedTags from './schematised-tags/schematised-tags.model';
import schematisedTagView from './schematised-tags/schematised-tag-view.model';
import trainingDatasetStatistics from './training-dataset/statistics/trainingDatasetStatistics.model';
import trainingDatasetStatisticsCommits from './training-dataset/statistics/trainingDatasetStatisticsCommits.model';
import featureGroupActivity from './feature/activity/featureGroupActivity.model';
import members from './projects/members.model';

export interface RootModel extends Models<RootModel> {
  api: typeof api;
  auth: typeof auth;
  store: typeof store;
  scope: typeof scope;
  search: typeof search;
  basket: typeof basket;
  dataset: typeof dataset;
  members: typeof members;
  project: typeof project;
  deepSearch: typeof deepSearch;
  projectsList: typeof projectsList;
  roleMappings: typeof roleMappings;
  featureGroups: typeof featureGroups;
  featureStores: typeof featureStores;
  schematisedTags: typeof schematisedTags;
  featureGroupView: typeof featureGroupView;
  featureGroupRows: typeof featureGroupRows;
  featureGroupLabels: typeof featureGroupLabels;
  schematisedTagView: typeof schematisedTagView;
  trainingDatasets: typeof trainingDatasetModel;
  featureGroupActivity: typeof featureGroupActivity;
  featureGroupStatistics: typeof featureGroupStatistics;
  trainingDatasetView: typeof trainingDatasetView;
  trainingDatasetLabels: typeof trainingDatasetLabelModel;
  trainingDatasetQuery: typeof trainingDatasetQuery;
  featureStoreSources: typeof featureStoreSources;
  featureGroupDataPreview: typeof featureGroupDataPreview;
  featureGroupCommitsDetail: typeof featureGroupCommitsDetail;
  featureGroupStatisticsCommits: typeof featureGroupStatisticsCommits;
  trainingDatasetStatistics: typeof trainingDatasetStatistics;
  trainingDatasetStatisticsCommits: typeof trainingDatasetStatisticsCommits;
}

const models: RootModel = {
  api,
  auth,
  scope,
  store,
  search,
  basket,
  dataset,
  profile,
  project,
  members,
  deepSearch,
  roleMappings,
  projectsList,
  featureGroups,
  featureStores,
  schematisedTags,
  featureGroupView,
  featureGroupRows,
  featureGroupLabels,
  schematisedTagView,
  featureStoreSources,
  featureGroupActivity,
  featureGroupStatistics,
  featureGroupDataPreview,
  featureGroupCommitsDetail,
  featureGroupStatisticsCommits,
  trainingDatasets: trainingDatasetModel,
  trainingDatasetView,
  trainingDatasetStatistics,
  trainingDatasetStatisticsCommits,
  trainingDatasetLabels: trainingDatasetLabelModel,
  trainingDatasetQuery,
};

export default models;
