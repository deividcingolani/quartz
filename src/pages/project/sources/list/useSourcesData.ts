import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Types
import { Dispatch } from '../../../../store';
import { FeatureStoreSourcesState } from '../../../../store/models/feature/sources/featureStoreSources.model';
// Selectors
import {
  selectFeatureStoreSources,
  selectFeatureStoreSourcesLoading,
} from '../../../../store/models/feature/sources/selectors';
import { selectFeatureStoreData } from '../../../../store/models/feature/selectors';

export interface UseSourcesData {
  isLoading: boolean;
  data: FeatureStoreSourcesState;
}

const useSourcesData = (projectId: number): UseSourcesData => {
  const data = useSelector(selectFeatureStoreSources);
  const isSourcesLoading = useSelector(selectFeatureStoreSourcesLoading);
  const { data: featureStoreData, isLoading: isFSLoading } = useSelector(
    selectFeatureStoreData,
  );

  const isLoading = isFSLoading || isSourcesLoading;

  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    if (!data.length && featureStoreData?.featurestoreId) {
      dispatch.featureStoreSources.fetch({
        projectId,
        featureStoreId: featureStoreData?.featurestoreId,
      });
    }
  }, [projectId, featureStoreData, data.length, dispatch]);

  return useMemo(
    () => ({
      isLoading,
      data,
    }),
    [isLoading, data],
  );
};

export default useSourcesData;
