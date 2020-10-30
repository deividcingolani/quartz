import { createModel } from '@rematch/core';
import FeatureGroupsService from '../../../services/project/FeatureGroupsService';
import { FeatureGroup } from '../../../types/feature-group';

export type FeatureGroupViewState = FeatureGroup | null;

const featureGroupView = createModel()({
  state: null as FeatureGroupViewState,
  reducers: {
    setData: (
      _: FeatureGroupViewState,
      payload: FeatureGroup,
    ): FeatureGroupViewState => payload,
    clear: () => null,
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
      const data = await FeatureGroupsService.get(
        projectId,
        featureStoreId,
        featureGroupId,
      );

      dispatch.featureGroupLabels.fetch({
        projectId,
        featureStoreId,
        featureGroupId,
      });

      dispatch.featureGroupView.setData(data);
    },
  }),
});

export default featureGroupView;
