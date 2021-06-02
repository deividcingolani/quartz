import { createModel } from '@rematch/core';
import FeatureGroupsService from '../../../../services/project/FeatureGroupsService';

export type FeatureGroupStatisticsCommitsState = string[];

const featureGroupStatisticsCommits = createModel()({
  state: [] as FeatureGroupStatisticsCommitsState,
  reducers: {
    setData: (
      _: FeatureGroupStatisticsCommitsState,
      payload: FeatureGroupStatisticsCommitsState,
    ): FeatureGroupStatisticsCommitsState => payload,
    clear: (): FeatureGroupStatisticsCommitsState => [],
  },
  effects: (dispatch) => ({
    fetch: async ({
      projectId,
      featureStoreId,
      featureGroupId,
    }: {
      projectId: number;
      featureStoreId: number;
      featureGroupId: number;
    }): Promise<void> => {
      const { data } = await FeatureGroupsService.getCommits(
        projectId,
        featureStoreId,
        featureGroupId,
      );

      const commits = data?.items?.map((item) => item.commitTime) || [];

      dispatch.featureGroupStatisticsCommits.setData(commits);
    },
  }),
});

export default featureGroupStatisticsCommits;
