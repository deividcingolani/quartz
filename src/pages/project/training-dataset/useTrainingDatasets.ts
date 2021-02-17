import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Selectors

import * as selector from '../../../store/models/training-dataset/training-dataset.selectors';
// Types
import { Dispatch, RootState } from '../../../store';
import { ISelectData } from '../../../store/types';
import { TrainingDataset } from '../../../types/training-dataset';

const useTrainingDatasets = (
  projectId: number,
  featureStoreId?: number,
): ISelectData<TrainingDataset[]> => {
  const dispatch = useDispatch<Dispatch>();

  const { data, isLoading } = useSelector(selector.selectTrainingDatasetsData);

  const searchTds = useSelector(
    (state: RootState) => state.search.trainingDatasets,
  );

  useEffect(() => {
    if (!data.length && featureStoreId) {
      if (searchTds.length) {
        dispatch.trainingDatasets.fetchAfterSearch({
          projectId,
          featureStoreId,
          data: searchTds,
        });
      } else {
        dispatch.trainingDatasets.fetch({ projectId, featureStoreId });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, data.length, projectId, featureStoreId]);

  return { data, isLoading };
};

export default useTrainingDatasets;
