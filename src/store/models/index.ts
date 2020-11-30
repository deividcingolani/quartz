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
import featureGroupDataPreview from './feature/data/featureGroupsDataPreview.model';
import featureGroupStatistics from './feature/statistics/featureGroupStatistics.model';

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
  featureStoreSources: typeof featureStoreSources;
  featureGroupStatistics: typeof featureGroupStatistics;
  trainingDatasetLabels: typeof trainingDatasetLabelModel;
  featureGroupDataPreview: typeof featureGroupDataPreview;
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
  trainingDatasets: trainingDatasetModel,
  trainingDatasetLabels: trainingDatasetLabelModel,
};

export default models;
