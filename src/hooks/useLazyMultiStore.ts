import { useMemo } from 'react';
import { useSelector } from 'react-redux';
// Selectors
import { selectFeatureStoresData } from '../store/models/feature/selectors';

export interface UseLazyMultiStoreOut<T> {
  get: () => T;
  projectName: string;
  featureStoreId: number;
  projectId: number;
}

const useLazyMultiStore = <T>(
  hook: (projectId: number, featureStoreId: number) => T,
): UseLazyMultiStoreOut<T>[] => {
  const { data: featureStores } = useSelector(selectFeatureStoresData);

  return useMemo(
    () =>
      (featureStores || []).reduce((acc, fs) => {
        acc[fs.featurestoreId] = {
          get: () => hook(fs.projectId, fs.featurestoreId),
          projectName: fs.projectName,
          featureStoreId: fs.featurestoreId,
          projectId: fs.projectId,
        };
        return acc;
      }, {} as any),
    [featureStores, hook],
  );
};

export default useLazyMultiStore;
