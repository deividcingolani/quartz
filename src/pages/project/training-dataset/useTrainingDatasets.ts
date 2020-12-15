import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Selectors

import * as selector from '../../../store/models/training-dataset/training-dataset.selectors';
// Types
import { Dispatch } from '../../../store';
import { ISelectData } from '../../../store/types';
import { TrainingDataset } from '../../../types/training-dataset';

const useTrainingDatasets = (
  projectId: number,
  featureStoreId?: number,
): ISelectData<TrainingDataset[]> => {
  const dispatch = useDispatch<Dispatch>();

  const { data, isLoading } = useSelector(selector.selectTrainingDatasetsData);

  useEffect(() => {
    if (!data.length && featureStoreId) {
      dispatch.trainingDatasets.fetch({ projectId, featureStoreId });
    }
  }, [dispatch, data.length, projectId, featureStoreId]);

  return { data, isLoading };
};

export default useTrainingDatasets;
