import { RootState } from '../../index';
import { TrainingDataset } from '../../../types/training-dataset';
import { ISelectData } from '../../types';

export const selectTrainingDatasetsData = ({
  trainingDatasets,
  trainingDatasetLabels,
  loading,
}: RootState): ISelectData<TrainingDataset[]> => {
  return {
    data: trainingDatasets.map((ds) => {
      const labels = trainingDatasetLabels[ds.id];

      ds.labels = labels?.map(({ name }) => name) || [];

      return ds;
    }),
    isLoading: loading.effects.trainingDatasets.fetch,
  };
};
