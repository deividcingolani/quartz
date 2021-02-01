import { createModel } from '@rematch/core';

// Services
import SchematisedTagsService from '../../../services/settings/SchematisedTags.Service';
// Types
import { SchematisedTagEntity } from '../../../types/feature-group';

export type SchematisedTagState = SchematisedTagEntity[];

const schematisedTags = createModel()({
  state: [] as SchematisedTagState,
  reducers: {
    setData: (
      _: SchematisedTagState,
      payload: SchematisedTagState,
    ): SchematisedTagState => payload,
    clear: () => [],
  },
  effects: (dispatch) => ({
    fetch: async (): Promise<void> => {
      const data = await SchematisedTagsService.getList();

      const { items = [] } = data;

      const mapped = items.map((item: SchematisedTagsServer) => {
        const { description, properties, required } = JSON.parse(item.value);

        return {
          ...item,
          description: description,
          properties: properties,
          required: required,
        };
      });

      dispatch.schematisedTags.setData(mapped);
    },
  }),
});

type SchematisedTagsServer = {
  id: number;
  name: string;
  value: string;
};

export default schematisedTags;
