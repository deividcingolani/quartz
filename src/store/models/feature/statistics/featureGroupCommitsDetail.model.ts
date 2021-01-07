import { createModel } from '@rematch/core';
import FeatureGroupsService from '../../../../services/project/FeatureGroupsService';
import { FeatureGroupCommitDetail } from '../../../../types/feature-group';

export type FeatureGroupCommitsDetailState = FeatureGroupCommitDetail[];

const featureGroupCommitsDetail = createModel()({
  state: [] as FeatureGroupCommitsDetailState,
  reducers: {
    setData: (
      _: FeatureGroupCommitsDetailState,
      payload: FeatureGroupCommitsDetailState,
    ): FeatureGroupCommitsDetailState => payload,
    clear: (): FeatureGroupCommitsDetailState => [],
  },
  effects: (dispatch) => ({
    fetch: async ({
      projectId,
      featureStoreId,
      featureGroupId,
      limit,
    }: {
      projectId: number;
      featureStoreId: number;
      featureGroupId: number;
      limit: number;
    }): Promise<void> => {
      const { data } = await FeatureGroupsService.getCommitsDetail(
        projectId,
        featureStoreId,
        featureGroupId,
        limit,
      );
      dispatch.featureGroupCommitsDetail.setData(data.items || []);
    },
  }),
});

export default featureGroupCommitsDetail;
