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
    clear: () => [],
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
      await Promise.allSettled(
        data.map(async (group) => {
          group.type === 'cachedFeaturegroupDTO' &&
            (await dispatch.featureGroupLabels.fetch({
              projectId,
              featureStoreId,
              featureGroupId: group.id,
            }));
        }),
      );

      dispatch.featureGroups.setFeatureGroups(data);
    },
    create: async ({
      projectId,
      featureStoreId,
      data,
    }: {
      projectId: number;
      featureStoreId: number;
      data: any;
    }): Promise<any> => {
      const createdGroup = await FeatureGroupsService.create(
        projectId,
        featureStoreId,
        data,
      );

      return Promise.allSettled(
        data.labels.map(
          async (label: string) =>
            await FeatureGroupsService.attachLabel(
              projectId,
              featureStoreId,
              createdGroup.data.id,
              label,
            ),
        ),
      );
    },
    edit: async ({
      projectId,
      featureStoreId,
      featureGroupId,
      data,
    }: {
      projectId: number;
      featureStoreId: number;
      featureGroupId: number;
      data: any;
    }): Promise<any> => {
      await FeatureGroupsService.edit(
        projectId,
        featureStoreId,
        featureGroupId,
        data,
      );
      return Promise.allSettled(
        data.labels.map(
          async (label: string) =>
            await FeatureGroupsService.attachLabel(
              projectId,
              featureStoreId,
              featureGroupId,
              label,
            ),
        ),
      );
    },
    delete: async ({
      projectId,
      featureStoreId,
      featureGroupId,
    }: {
      projectId: number;
      featureStoreId: number;
      featureGroupId: number;
    }): Promise<any> => {
      await FeatureGroupsService.delete(
        projectId,
        featureStoreId,
        featureGroupId,
      );
    },
  }),
});

export default featureGroups;
