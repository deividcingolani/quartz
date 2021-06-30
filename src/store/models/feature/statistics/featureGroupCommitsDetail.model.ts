import { createModel } from '@rematch/core';
import FeatureGroupsService from '../../../../services/project/FeatureGroupsService';
import ProvenanceService from '../../../../services/project/ProvenanceService';
import {
  FeatureGroup,
  FeatureGroupCommitDetail,
} from '../../../../types/feature-group';

export type FeatureGroupCommitsDetailState = {
  commits: FeatureGroupCommitDetail[];
  tds: number;
};

const featureGroupCommitsDetail = createModel()({
  state: { commits: [], tds: 0 } as FeatureGroupCommitsDetailState,
  reducers: {
    setData: (
      _: FeatureGroupCommitsDetailState,
      payload: FeatureGroupCommitsDetailState,
    ): FeatureGroupCommitsDetailState => payload,
    setDataTds: (
      _state: FeatureGroupCommitsDetailState,
      payload: number,
    ): FeatureGroupCommitsDetailState => ({ commits: [], tds: payload }),
    clear: (): FeatureGroupCommitsDetailState => ({ commits: [], tds: 0 }),
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

      dispatch.featureGroupCommitsDetail.setData({
        commits: data.items || [],
        tds: 10,
      });
    },
    fetchTD: async ({
      projectId,
      featureGroup,
    }: {
      projectId: number;
      featureGroup: FeatureGroup;
    }): Promise<void> => {
      const data = await ProvenanceService.getTDProvenance({
        projectId,
        featureGroup,
      });
      dispatch.featureGroupCommitsDetail.setDataTds(data?.items?.length || 0);
    },
  }),
});

export default featureGroupCommitsDetail;
