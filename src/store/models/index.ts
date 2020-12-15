import { Models } from '@rematch/core';

// Models
import auth from './auth/auth.model';
import profile from './profile/profile.model';
import project from './projects/project.model';
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
import featureGroupStatisticsCommits from './feature/statistics/featureGroupStatisticsCommits.model';
import trainingDatasetQuery from './training-dataset/trainingDatasetQuery.model';

export interface RootModel extends Models<RootModel> {
  auth: typeof auth;
  profile: typeof profile;
  project: typeof project;
  projectsList: typeof projectsList;
  featureGroups: typeof featureGroups;
  featureStores: typeof featureStores;
  featureGroupView: typeof featureGroupView;
  featureGroupRows: typeof featureGroupRows;
  featureGroupLabels: typeof featureGroupLabels;
  trainingDatasets: typeof trainingDatasetModel;
  featureGroupStatistics: typeof featureGroupStatistics;
  trainingDatasetView: typeof trainingDatasetView;
  trainingDatasetLabels: typeof trainingDatasetLabelModel;
  trainingDatasetQuery: typeof trainingDatasetQuery;
  featureStoreSources: typeof featureStoreSources;
  featureGroupDataPreview: typeof featureGroupDataPreview;
  featureGroupStatisticsCommits: typeof featureGroupStatisticsCommits;
}

const models: RootModel = {
  auth,
  profile,
  project,
  projectsList,
  featureGroups,
  featureStores,
  featureGroupView,
  featureGroupRows,
  featureGroupLabels,
  featureStoreSources,
  featureGroupStatistics,
  featureGroupDataPreview,
  featureGroupStatisticsCommits,
  trainingDatasets: trainingDatasetModel,
  trainingDatasetView,
  trainingDatasetLabels: trainingDatasetLabelModel,
  trainingDatasetQuery,
};

export default models;
