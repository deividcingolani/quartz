import { Models } from '@rematch/core';

// Models
import auth from './auth/auth.model';
import search from './search/search.model';
import profile from './profile/profile.model';
import project from './projects/project.model';
import deepSearch from './search/deep-search.model';
import projectsList from './projects/projectsList.model';
import featureGroups from './feature/featureGroups.model';
import { trainingDatasetModel } from './training-dataset';
import featureStores from './feature/featureStores.model';
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
import store from './localManagement/store.model';
import trainingDatasetStatistics from './training-dataset/statistics/trainingDatasetStatistics.model';
import trainingDatasetStatisticsCommits from './training-dataset/statistics/trainingDatasetStatisticsCommits.model';


export interface RootModel extends Models<RootModel> {
  auth: typeof auth;
  store: typeof store;
  search: typeof search;
  project: typeof project;
  profile: typeof profile;
  deepSearch: typeof deepSearch;
  projectsList: typeof projectsList;
  featureGroups: typeof featureGroups;
  featureStores: typeof featureStores;
  schematisedTags: typeof schematisedTags;
  featureGroupView: typeof featureGroupView;
  featureGroupRows: typeof featureGroupRows;
  featureGroupLabels: typeof featureGroupLabels;
  schematisedTagView: typeof schematisedTagView;
  trainingDatasets: typeof trainingDatasetModel;
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
  auth,
  store,
  search,
  profile,
  project,
  deepSearch,
  projectsList,
  featureGroups,
  featureStores,
  schematisedTags,
  featureGroupView,
  featureGroupRows,
  featureGroupLabels,
  schematisedTagView,
  featureStoreSources,
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
