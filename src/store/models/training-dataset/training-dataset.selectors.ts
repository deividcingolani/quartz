import { RootState } from '../../index';
import { TrainingDataset } from '../../../types/training-dataset';
import { ISelectData } from '../../types';

export const selectTrainingDatasetsData = ({
  trainingDatasets,
  loading,
}: RootState): ISelectData<TrainingDataset[]> => {
  return {
    data: trainingDatasets,
    isLoading: loading.effects.trainingDatasets.fetch,
  };
};

export default selectTrainingDatasetsData;
