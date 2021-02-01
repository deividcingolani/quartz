import { createModel } from '@rematch/core';

import { getNormalizedValue } from '../../../pages/project/feature-group/utils';
// Types
import { FeatureGroup } from '../../../types/feature-group';
// Services
import FeatureGroupsService from '../../../services/project/FeatureGroupsService';
import FeatureGroupLabelsService from '../../../services/project/FeatureGroupLabelsService';
import { getValidPromisesValues } from '../search/deep-search.model';

export type FeatureGroupState = FeatureGroup[];

const attachTags = async (
  projectId: number,
  featureStoreId: number,
  id: number,
  tags = {},
) => {
  const mapped = Object.entries(tags).map(([key, property]) => {
    // @ts-ignore
    const data = Object.entries(property)
      .map(([key, nestProperty]) => ({
        [key]: Array.isArray(nestProperty)
          ? nestProperty.map(({ value }) => getNormalizedValue(value))
          : getNormalizedValue(nestProperty),
      }))
      .reduce((acc, next) => {
        const value = Object.values(next)[0];

        return value !== null && value[0] !== null ? { ...acc, ...next } : acc;
      }, {});

    return {
      key,
      data,
    };
  });

  for (const { key, data } of mapped) {
    await FeatureGroupsService.attachTag(
      projectId,
      featureStoreId,
      id,
      key,
      data,
    );
  }
};

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

      dispatch.search.setFeatureGroups(data);

      dispatch.featureGroups.setFeatureGroups(
        data.map((group) => ({
          ...group,
          labels: [],
          updated: group.created,
          versions: data.map(({ version, id }) => ({ id, version })),
        })),
      );

      dispatch.featureGroups.fetchKeywordsAndLastUpdate({
        data,
        projectId,
        featureStoreId,
      });
    },
    fetchKeywordsAndLastUpdate: async ({
      data,
      projectId,
      featureStoreId,
    }: {
      data: FeatureGroup[];
      projectId: number;
      featureStoreId: number;
    }): Promise<void> => {
      await Promise.allSettled(
        data.map(async (group) => {
          const readLast = await FeatureGroupsService.getWriteLast(
            projectId,
            featureStoreId,
            group.id,
          );

          let keywords: string[] = [];
          if (group.type === 'cachedFeaturegroupDTO') {
            keywords = await FeatureGroupLabelsService.getList(
              projectId,
              featureStoreId,
              group.id,
            );
          }

          return {
            ...group,
            labels: keywords,
            updated: readLast || group.created,
            versions: data.map(({ version, id }) => ({ id, version })),
          };
        }),
      )
        .then((values) => getValidPromisesValues(values))
        .then((data) => dispatch.featureGroups.setFeatureGroups(data));
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
      const {
        data: { id },
      } = await FeatureGroupsService.create(projectId, featureStoreId, data);

      await FeatureGroupLabelsService.attachLabel(
        projectId,
        featureStoreId,
        id,
        data.keywords,
      );

      await attachTags(projectId, featureStoreId, id, data.tags);
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

      await FeatureGroupLabelsService.attachKeyword(
        projectId,
        featureStoreId,
        featureGroupId,
        data.keywords,
      );

      const { prevTags } = data;
      const newTags = Object.keys(data.tags || {});

      const deletedTags = prevTags.filter(
        (name: string) => !newTags.includes(name),
      );

      await Promise.allSettled(
        deletedTags.map(async (name: string) => {
          await FeatureGroupsService.deleteTag(
            projectId,
            featureStoreId,
            featureGroupId,
            name,
          );
        }),
      );

      await attachTags(projectId, featureStoreId, featureGroupId, data.tags);
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
