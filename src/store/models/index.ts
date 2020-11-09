import { Models } from '@rematch/core';

// Models
import profile from './profile/profile.model';
import projectsList from './projects/projectsList.model';
import featureGroups from './feature/featureGroups.model';
import featureStores from './feature/featureStores.model';
import featureGroupLabels from './feature/featureGroupLabels.model';
import featureGroupView from './feature/featureGroupView.model';
import featureGroupStatistics from './feature/statistics/featureGroupStatistics.model';
import featureGroupRows from './feature/statistics/featureGroupRows.model';
import { trainingDatasetModel } from './training-dataset';
import { trainingDatasetLabelModel } from './training-dataset-label';

export interface RootModel extends Models<RootModel> {
  profile: typeof profile;

  // Projects
  projectsList: typeof projectsList;
  // Feature
  featureGroups: typeof featureGroups;
  featureStores: typeof featureStores;
  featureGroupLabels: typeof featureGroupLabels;
  featureGroupView: typeof featureGroupView;
  featureGroupStatistics: typeof featureGroupStatistics;
  featureGroupRows: typeof featureGroupRows;
  trainingDatasets: typeof trainingDatasetModel;
  trainingDatasetLabels: typeof trainingDatasetLabelModel;
}

const models: RootModel = {
  profile,
  projectsList,
  featureGroups,
  featureStores,
  featureGroupLabels,
  featureGroupView,
  featureGroupStatistics,
  featureGroupRows,
  trainingDatasets: trainingDatasetModel,
  trainingDatasetLabels: trainingDatasetLabelModel,
};

export default models;
