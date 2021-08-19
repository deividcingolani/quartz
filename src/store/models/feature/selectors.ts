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

export const selectFeatureStoreData = (
  { featureStores, loading }: RootState,
  featurestoreId?: number,
): SelectData<FeatureStore | null> => {
  const fsIdx = featurestoreId
    ? featureStores?.findIndex(
        (fs: FeatureStore) => fs.featurestoreId === featurestoreId,
      )
    : null;

  return {
    data: featureStores?.length ? featureStores[fsIdx || 0] : null,
    isLoading: loading.effects.featureStores.fetch,
  };
};

export const selectFeatureStoresData = ({
  featureStores,
  loading,
}: RootState): SelectData<FeatureStore[] | null> => ({
  data: featureStores,
  isLoading: loading.effects.featureStores.fetch,
});
