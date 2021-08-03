import { Models } from '@rematch/core';

// Models
import api from './api/api.model';
import auth from './auth/auth.model';
import scope from './scope/scope.model';
import search from './search/search.model';
import secrets from './secrets/secrets.model';
import profile from './profile/profile.model';
import project from './projects/project.model';
import dataset from './dataset/dataset.model';
import deepSearch from './search/deep-search.model';
import store from './localManagement/store.model';
import basket from './localManagement/basket.model';
import projectsList from './projects/projectsList.model';
import featureGroups from './feature/featureGroups.model';
import featureStores from './feature/featureStores.model';
import roleMappings from './role-mappings/role-mappings.model';
import featureGroupView from './feature/featureGroupView.model';
import featureGroupLabels from './feature/featureGroupLabels.model';
import { trainingDatasetLabelModel } from './training-dataset-label';
import featureGroupRows from './feature/statistics/featureGroupRows.model';
import trainingDatasetView from './training-dataset/trainingDatasetView.model';
import featureGroupDataPreview from './feature/data/featureGroupsDataPreview.model';
import featureGroupStatistics from './feature/statistics/featureGroupStatistics.model';
import featureGroupCommitsDetail from './feature/statistics/featureGroupCommitsDetail.model';
import featureGroupStatisticsCommits from './feature/statistics/featureGroupStatisticsCommits.model';
import trainingDatasetQuery from './training-dataset/trainingDatasetQuery.model';
import schematisedTags from './schematised-tags/schematised-tags.model';
import schematisedTagView from './schematised-tags/schematised-tag-view.model';
import trainingDatasetStatistics from './training-dataset/statistics/trainingDatasetStatistics.model';
import featureStoreStorageConnectors from './feature/storageConnectors/featureStoreStorageConnectors.model';
import trainingDatasetStatisticsCommits from './training-dataset/statistics/trainingDatasetStatisticsCommits.model';
import featureGroupSchematisedTags from './feature/statistics/featureGroupSchematisedTags.model';
import featureGroupActivity from './feature/activity/featureGroupActivity.model';
import members from './projects/members.model';
import trainingDatasetActivity from './training-dataset/activity/trainingDatasetActivity.model';
import rules from './rules/rules.model';
import expectationView from './expectations/expectationView.model';
import validators from './validators/validators.model';
import jobs from './jobs/jobs.model';
import jobsRows from './jobs/data/jobsDataPreview.model';
import jobsView from './jobs/jobsView.model';
import jobsExecutions from './jobs/executions/jobsExecutions.model';
import featureStoreSettings from './settings/featureStoreSettings.model';
import fileExplorerDataset from './file-explorer/fileExplorerDataset.model';
import uploadFileData from './file-explorer/uploadFileData.model';
import crossProject from './projects/crossProject.model';
import multistore from './projects/multistore.model';
import provenance from './provenance/provenance.model';
import { trainingDatasetModel } from './training-dataset/training-dataset.model';
import databricks from './databricks/databricks.model';
import expectations from './expectations/expectations.model';

export interface RootModel extends Models<RootModel> {
  api: typeof api;
  auth: typeof auth;
  rules: typeof rules;
  store: typeof store;
  scope: typeof scope;
  search: typeof search;
  basket: typeof basket;
  secrets: typeof secrets;
  dataset: typeof dataset;
  members: typeof members;
  project: typeof project;
  profile: typeof profile;
  databricks: typeof databricks;
  deepSearch: typeof deepSearch;
  validators: typeof validators;
  projectsList: typeof projectsList;
  expectations: typeof expectations;
  roleMappings: typeof roleMappings;
  featureGroups: typeof featureGroups;
  featureStores: typeof featureStores;
  featureStoreSettings: typeof featureStoreSettings;
  expectationView: typeof expectationView;
  schematisedTags: typeof schematisedTags;
  featureGroupView: typeof featureGroupView;
  featureGroupRows: typeof featureGroupRows;
  featureGroupLabels: typeof featureGroupLabels;
  schematisedTagView: typeof schematisedTagView;
  trainingDatasets: typeof trainingDatasetModel;
  featureGroupActivity: typeof featureGroupActivity;
  trainingDatasetActivity: typeof trainingDatasetActivity;
  featureGroupStatistics: typeof featureGroupStatistics;
  trainingDatasetView: typeof trainingDatasetView;
  trainingDatasetLabels: typeof trainingDatasetLabelModel;
  trainingDatasetQuery: typeof trainingDatasetQuery;
  featureGroupDataPreview: typeof featureGroupDataPreview;
  featureGroupCommitsDetail: typeof featureGroupCommitsDetail;
  featureGroupSchematisedTags: typeof featureGroupSchematisedTags;
  featureGroupStatisticsCommits: typeof featureGroupStatisticsCommits;
  trainingDatasetStatistics: typeof trainingDatasetStatistics;
  featureStoreStorageConnectors: typeof featureStoreStorageConnectors;
  trainingDatasetStatisticsCommits: typeof trainingDatasetStatisticsCommits;
  jobs: typeof jobs;
  jobsRows: typeof jobsRows;
  jobsView: typeof jobsView;
  jobsExecutions: typeof jobsExecutions;
  fileExplorerDataset: typeof fileExplorerDataset;
  uploadFileData: typeof uploadFileData;
  crossProject: typeof crossProject;
  multistore: typeof multistore;
  provenance: typeof provenance;
}

const models: RootModel = {
  api,
  auth,
  scope,
  rules,
  store,
  search,
  basket,
  dataset,
  profile,
  project,
  members,
  secrets,
  deepSearch,
  validators,
  expectations,
  roleMappings,
  databricks,
  projectsList,
  featureGroups,
  featureStores,
  featureStoreSettings,
  schematisedTags,
  expectationView,
  featureGroupView,
  featureGroupRows,
  featureGroupLabels,
  schematisedTagView,
  featureGroupActivity,
  featureGroupStatistics,
  trainingDatasetActivity,
  featureGroupDataPreview,
  featureGroupCommitsDetail,
  featureGroupSchematisedTags,
  featureGroupStatisticsCommits,
  trainingDatasets: trainingDatasetModel,
  trainingDatasetView,
  trainingDatasetStatistics,
  featureStoreStorageConnectors,
  trainingDatasetStatisticsCommits,
  trainingDatasetLabels: trainingDatasetLabelModel,
  trainingDatasetQuery,
  jobs,
  jobsRows,
  jobsView,
  jobsExecutions,
  fileExplorerDataset,
  uploadFileData,
  crossProject,
  multistore,
  provenance,
};

export default models;
