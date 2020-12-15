import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch, RootState } from '../../../../store';

import { selectFeatureStoreData } from '../../../../store/models/feature/selectors';
import { TrainingDatasetViewState } from '../../../../store/models/training-dataset/trainingDatasetView.model';

export interface UseTrainingDatasetView {
  data: TrainingDatasetViewState;
  isLoading: boolean;
  fetchData: () => void;
}

const useTrainingDatasetView = (
  projectId: number,
  tdId: number,
): UseTrainingDatasetView => {
  const { data: featureStoreData } = useSelector(selectFeatureStoreData);

  const isLoading = useSelector(
    (state: RootState) => state.loading.effects.trainingDatasetView.fetch,
  );

  const data = useSelector<RootState, TrainingDatasetViewState>(
    (state) => state.trainingDatasetView,
  );

  const dispatch = useDispatch<Dispatch>();

  const fetchData = useCallback(() => {
    if (featureStoreData?.featurestoreId && !isLoading) {
      dispatch.trainingDatasetView.fetch({
        projectId,
        featureStoreId: featureStoreData.featurestoreId,
        trainingDatasetId: tdId,
      });
    }
  }, [dispatch, tdId, isLoading, featureStoreData, projectId]);

  useEffect(() => {
    if (
      tdId !== data?.id ||
      featureStoreData?.featurestoreId !== data.featurestoreId
    ) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.id, data?.featurestoreId, projectId, tdId]);

  return {
    data,
    isLoading,
    fetchData,
  };
};

export default useTrainingDatasetView;
