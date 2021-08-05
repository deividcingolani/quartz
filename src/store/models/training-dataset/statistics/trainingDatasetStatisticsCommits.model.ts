import { createModel } from '@rematch/core';
import TrainingDatasetService from '../../../../services/project/TrainingDatasetService';

export type TrainingDatasetStatisticsCommitsState = string[];

const trainingDatasetStatisticsCommits = createModel()({
  state: [] as TrainingDatasetStatisticsCommitsState,
  reducers: {
    setData: (
      _: TrainingDatasetStatisticsCommitsState,
      payload: TrainingDatasetStatisticsCommitsState,
    ): TrainingDatasetStatisticsCommitsState => payload,
    clear: (): TrainingDatasetStatisticsCommitsState => [],
  },
  effects: (dispatch) => ({
    fetch: async ({
      projectId,
      featureStoreId,
      trainingDatasetId,
    }: {
      projectId: number;
      featureStoreId: number;
      trainingDatasetId: number;
    }): Promise<void> => {
      const { data } = await TrainingDatasetService.getStatisticsCommits(
        projectId,
        featureStoreId,
        trainingDatasetId,
      );

      const commits = data.items?.map((item) => item.commitTime) || [];

      dispatch.trainingDatasetStatisticsCommits.setData(commits);
    },
  }),
});

export default trainingDatasetStatisticsCommits;
