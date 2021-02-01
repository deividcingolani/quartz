import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch, RootState } from '../../../../store';

//Types
import { FeatureGroupViewState } from '../../../../store/models/feature/featureGroupView.model';
// Selectors
import { selectFeatureStoreData } from '../../../../store/models/feature/selectors';

export interface UseFeatureGroupView {
  data: FeatureGroupViewState;
  isLoading: boolean;
  fetchData: () => void;
}

const useFeatureGroupView = (
  projectId: number,
  fgId: number,
): UseFeatureGroupView => {
  const { data: featureStoreData } = useSelector(selectFeatureStoreData);
  const isLoading = useSelector(
    (state: RootState) => state.loading.effects.featureGroupView.fetch,
  );

  const data = useSelector<RootState, FeatureGroupViewState>(
    (state) => state.featureGroupView,
  );

  const dispatch = useDispatch<Dispatch>();

  const fetchData = useCallback(() => {
    if (featureStoreData?.featurestoreId && !isLoading) {
      dispatch.featureGroupView.fetch({
        projectId,
        featureStoreId: featureStoreData.featurestoreId,
        featureGroupId: fgId,
      });
    }
  }, [dispatch, fgId, isLoading, featureStoreData, projectId]);

  useEffect(() => {
    if (
      fgId !== data?.id ||
      featureStoreData?.featurestoreId !== data.featurestoreId
    ) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.id, data?.featurestoreId, projectId, fgId]);

  return {
    data,
    isLoading,
    fetchData,
  };
};

export default useFeatureGroupView;
