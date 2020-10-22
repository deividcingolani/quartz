import { Models } from '@rematch/core';

// Models
import profile from './profile/profile.model';
import projectsList from './projects/projectsList.model';
import featureGroups from './feature/featureGroups.model';
import featureStores from './feature/featureStores.model';
import featureGroupLabels from './feature/featureGroupLabels.model';

export interface RootModel extends Models<RootModel> {
  profile: typeof profile;

  // Projects
  projectsList: typeof projectsList;
  // Feature
  featureGroups: typeof featureGroups;
  featureStores: typeof featureStores;
  featureGroupLabels: typeof featureGroupLabels;
}

const models: RootModel = {
  profile,
  projectsList,
  featureGroups,
  featureStores,
  featureGroupLabels,
};

export default models;
