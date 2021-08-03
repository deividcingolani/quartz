import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Dispatch, RootState } from '../../../../store';

// Types
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
  fsId: number,
): UseFeatureGroupView => {
  const { commitTime } = useParams();
  const { data: featureStoreData } = useSelector((state: RootState) =>
    selectFeatureStoreData(state, fsId),
  );
  const isLoading = useSelector(
    (state: RootState) => state.loading.effects.featureGroupView.fetch,
  );

  const data = useSelector<RootState, FeatureGroupViewState>(
    (state) => state.featureGroupView,
  );

  const dispatch = useDispatch<Dispatch>();

  const fetchData = useCallback(() => {
    dispatch.featureGroupStatistics.clear();
    if (featureStoreData && fsId && !isLoading) {
      dispatch.featureGroupStatistics.fetch({
        projectId: +projectId,
        featureStoreId: fsId,
        featureGroupId: +fgId,
        timeCommit: commitTime,
      });

      return dispatch.featureGroupView.fetch({
        projectId,
        featureStoreId: fsId,
        featureGroupId: fgId,
      });
    }
    return {};
  }, [
    dispatch.featureGroupStatistics,
    dispatch.featureGroupView,
    featureStoreData,
    fsId,
    isLoading,
    projectId,
    fgId,
    commitTime,
  ]);

  useEffect(() => {
    if (fgId !== data?.id || fsId !== data.featurestoreId) {
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
