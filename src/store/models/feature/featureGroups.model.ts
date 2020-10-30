import { createModel } from '@rematch/core';
import FeatureGroupsService from '../../../services/project/FeatureGroupsService';
import { FeatureGroup } from '../../../types/feature-group';

export type FeatureGroupState = FeatureGroup[];

const featureGroups = createModel()({
  state: [] as FeatureGroupState,
  reducers: {
    setFeatureGroups: (
      _: FeatureGroupState,
      payload: FeatureGroup[],
    ): FeatureGroupState => payload,
  },
  effects: (dispatch) => ({
    fetch: async ({
      projectId,
      featureStoreId,
    }: {
      projectId: number;
      featureStoreId: number;
    }): Promise<void> => {
      const data = await FeatureGroupsService.getList(
        projectId,
        featureStoreId,
      );

      // Fetch labels for each feature group
      data.forEach(({ id }) => {
        dispatch.featureGroupLabels.fetch({
          projectId,
          featureStoreId,
          featureGroupId: id,
        });
      });

      dispatch.featureGroups.setFeatureGroups(data);
    },
  }),
});

export default featureGroups;
