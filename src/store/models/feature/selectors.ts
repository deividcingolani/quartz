import { FeatureGroup } from '../../../types/feature-group';
import { FeatureStore } from '../../../types/feature-store';
import { RootState } from '../../index';

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
