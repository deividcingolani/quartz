import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Selectors

import * as selector from '../../../store/models/training-dataset/training-dataset.selectors';
// Types
import { Dispatch, RootState } from '../../../store';
import { ISelectData } from '../../../store/types';
import { TrainingDataset } from '../../../types/training-dataset';

export type UseTrainingDatasetsData = ISelectData<TrainingDataset[]>;

const useTrainingDatasets = (
  projectId: number,
  featureStoreId?: number,
): UseTrainingDatasetsData => {
  const dispatch = useDispatch<Dispatch>();

  const { data, isLoading } = useSelector(selector.selectTrainingDatasetsData);

  const searchTds = useSelector(
    (state: RootState) => state.search.trainingDatasets,
  );

  useEffect(() => {
    if (
      featureStoreId &&
      (!data.length || data[0].featurestoreId !== featureStoreId)
    ) {
      if (searchTds.length && searchTds[0].featurestoreId === featureStoreId) {
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
