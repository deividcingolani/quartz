import { Models } from '@rematch/core';
import profile from './profile/profile.model';
import projectsList from './projects/projectsList.model';
import featureGroups from './feature/featureGroups.model';
import featureStores from './feature/featureStores.model';
import featureGroupLabels from './feature/featureGroupLabels.model';
import { trainingDatasetModel } from './training-dataset';
import { trainingDatasetLabelModel } from './training-dataset-label';

export interface RootModel extends Models<RootModel> {
  profile: typeof profile;
  projectsList: typeof projectsList;
  featureGroups: typeof featureGroups;
  featureStores: typeof featureStores;
  featureGroupLabels: typeof featureGroupLabels;
  trainingDatasets: typeof trainingDatasetModel;
  trainingDatasetLabels: typeof trainingDatasetLabelModel;
}

const models: RootModel = {
  profile,
  projectsList,
  featureGroups,
  featureStores,
  featureGroupLabels,
  trainingDatasets: trainingDatasetModel,
  trainingDatasetLabels: trainingDatasetLabelModel,
};

export default models;
