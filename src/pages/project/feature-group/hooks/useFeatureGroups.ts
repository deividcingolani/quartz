import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Types
import { Dispatch } from '../../../../store';
import { FeatureGroup } from '../../../../types/feature-group';
// Selectors
import {
  SelectData,
  selectFeatureGroupsData,
} from '../../../../store/models/feature/selectors';

const useFeatureGroups = (
  projectId: number,
  featureStoreId?: number,
): SelectData<FeatureGroup[]> => {
  const { data, isLoading } = useSelector(selectFeatureGroupsData);

  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    if (!data.length && featureStoreId) {
      dispatch.featureGroups.fetch({ projectId, featureStoreId });
    }
  }, [dispatch, data.length, projectId, featureStoreId]);

  return { data, isLoading };
};

export default useFeatureGroups;
