import { createModel } from '@rematch/core';

import { Tag } from '../../../../types';
import { SchemaType } from '../featureGroupView.model';
import FeatureGroupsService from '../../../../services/project/FeatureGroupsService';

export type FeatureGroupSchematisedTagsState = Tag[];

const featureGroupSchematisedTags = createModel()({
  state: [] as FeatureGroupSchematisedTagsState,
  reducers: {
    setData: (
      _: FeatureGroupSchematisedTagsState,
      payload: FeatureGroupSchematisedTagsState,
    ): FeatureGroupSchematisedTagsState => payload,
    clear: (): FeatureGroupSchematisedTagsState => [],
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
      const { data } = await FeatureGroupsService.getTags(
        projectId,
        featureStoreId,
        featureGroupId,
      );

      const { items = [] } = data;

      const mappedTags = items.map(({ name, value, schema }: any) => {
        const tags = JSON.parse(value);
        const { properties }: SchemaType = JSON.parse(schema.value);

        return {
          name,
          tags,
          types: Object.entries(properties).reduce(
            (acc, [key, value]) => ({
              ...acc,
              [key]:
                value.type === 'array'
                  ? `Array of ${value.items.type}`
                  : value.type,
            }),
            {},
          ),
        };
      });

      dispatch.featureGroupSchematisedTags.setData(mappedTags);
    },
  }),
});

export default featureGroupSchematisedTags;
