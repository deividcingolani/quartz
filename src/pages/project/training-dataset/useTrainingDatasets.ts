import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as selector from '../../../store/models/training-dataset/training-dataset.selectors';
import { Dispatch } from '../../../store';
import { ISelectData } from '../../../store/types';
import { ITrainingDataset } from '../../../types/training-dataset';

const useTrainingDatasets = (
  projectId: number,
  featureStoreId?: number,
): ISelectData<ITrainingDataset[]> => {
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
