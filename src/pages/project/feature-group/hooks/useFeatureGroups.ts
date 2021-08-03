import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Types
import { Dispatch, RootState } from '../../../../store';
import { FeatureGroup } from '../../../../types/feature-group';
// Selectors
import {
  SelectData,
  selectFeatureGroupsData,
} from '../../../../store/models/feature/selectors';

export type UseFeatureGroupsData = SelectData<FeatureGroup[]>;

const useFeatureGroups = (
  projectId: number,
  featureStoreId?: number,
): UseFeatureGroupsData => {
  const { data, isLoading } = useSelector(selectFeatureGroupsData);

  const dispatch = useDispatch<Dispatch>();

  const searchFgs = useSelector(
    (state: RootState) => state.search.featureGroups,
  );

  useEffect(() => {
    if (
      featureStoreId &&
      (!data.length || data[0].featurestoreId !== featureStoreId)
    ) {
      if (searchFgs.length && searchFgs[0].featurestoreId === featureStoreId) {
        dispatch.featureGroups.fetchAfterSearch({
          projectId,
          featureStoreId,
          data: searchFgs,
        });
      } else {
        dispatch.featureGroups.fetch({ projectId, featureStoreId });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, data.length, projectId, featureStoreId]);

  return { data, isLoading };
};

export default useFeatureGroups;
