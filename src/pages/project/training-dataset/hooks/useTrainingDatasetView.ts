import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Dispatch, RootState } from '../../../../store';

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
  const { fsId } = useParams();

  const isLoading = useSelector(
    (state: RootState) => state.loading.effects.trainingDatasetView.fetch,
  );

  const data = useSelector<RootState, TrainingDatasetViewState>(
    (state) => state.trainingDatasetView,
  );

  const dispatch = useDispatch<Dispatch>();

  const fetchData = useCallback(() => {
    if (!isLoading) {
      dispatch.trainingDatasetView.fetch({
        projectId,
        featureStoreId: +fsId,
        trainingDatasetId: tdId,
      });
    }
  }, [dispatch, tdId, isLoading, fsId, projectId]);

  useEffect(() => {
    if (tdId !== data?.id || +fsId !== data.featurestoreId) {
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
