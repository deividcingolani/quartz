import { useMemo } from 'react';
// Hooks
import { useSelector } from 'react-redux';
// Selectors
import { selectFeatureStoresData } from '../store/models/feature/selectors';

export interface UseLazyMultiStoreOut<T> {
  get: () => T;
  projectName: string;
  featureStoreId: number;
  projectId: number;
}

export type MultistoresMap<T> = Record<string, UseLazyMultiStoreOut<T>>;

const useLazyMultiStore = <T>(
  hook: (projectId: number, featureStoreId: number) => T,
): MultistoresMap<T> => {
  const { data: featureStores } = useSelector(selectFeatureStoresData);

  return useMemo(() => {
    const target = (featureStores || []).reduce((acc, fs) => {
      acc[fs.featurestoreId] = {
        get: () => hook(fs.projectId, fs.featurestoreId),
        projectName: fs.projectName,
        featureStoreId: fs.featurestoreId,
        projectId: fs.projectId,
      };
      return acc;
    }, {} as MultistoresMap<T>);

    return new Proxy(target, {
      get: (target, key) => {
        return key in target
          ? target[key as string]
          : { get: () => ({ invalidFS: true }) };
      },
    });
  }, [featureStores, hook]);
};

export default useLazyMultiStore;
