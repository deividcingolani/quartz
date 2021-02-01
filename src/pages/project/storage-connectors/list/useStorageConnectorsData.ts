import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Types
import { Dispatch } from '../../../../store';
import { FeatureStoreStorageConnectorsState } from '../../../../store/models/feature/storageConnectors/featureStoreStorageConnectors.model';
// Selectors
import {
  selectFeatureStoreStorageConnectors,
  selectFeatureStoreStorageConnectorsLoading,
} from '../../../../store/models/feature/storageConnectors/selectors';
import { selectFeatureStoreData } from '../../../../store/models/feature/selectors';

export interface UseStorageConnectorsData {
  isLoading: boolean;
  data: FeatureStoreStorageConnectorsState;
}

const useStorageConnectorsData = (
  projectId: number,
): UseStorageConnectorsData => {
  const data = useSelector(selectFeatureStoreStorageConnectors);
  const isStorageConnectorsLoading = useSelector(
    selectFeatureStoreStorageConnectorsLoading,
  );
  const { data: featureStoreData, isLoading: isFSLoading } = useSelector(
    selectFeatureStoreData,
  );

  const isLoading = isFSLoading || isStorageConnectorsLoading;

  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    if (!data.length && featureStoreData?.featurestoreId) {
      dispatch.featureStoreStorageConnectors.fetch({
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

export default useStorageConnectorsData;
