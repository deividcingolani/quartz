import { FeatureGroup } from '../../../types/feature-group';
import { FeatureStore } from '../../../types/feature-store';
import { RootState } from '../../index';
import { Jobs } from '../../../types/jobs';

export type SelectData<Data> = {
  data: Data;
  isLoading: boolean;
};

export const selectFeatureGroupsData = ({
  featureGroups,
  loading,
}: RootState): SelectData<FeatureGroup[]> => ({
  data: featureGroups,
  isLoading: loading.effects.featureGroups.fetch,
});

export const selectFeatureStoreData = ({
  featureStores,
  loading,
}: RootState): SelectData<FeatureStore | null> => ({
  data: featureStores?.length ? featureStores[0] : null,
  isLoading: loading.effects.featureStores.fetch,
});

export const selectJobsData = ({
  jobs,
  loading,
}: RootState): SelectData<Jobs[]> => ({
  data: jobs,
  isLoading: loading.effects.jobs.fetch,
});
