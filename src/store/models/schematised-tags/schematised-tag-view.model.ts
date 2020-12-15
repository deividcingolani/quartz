import { createModel } from '@rematch/core';

// Services
import SchematisedTagsService from '../../../services/settings/SchematisedTags.Service';
// Types
import { SchematisedTagEntity } from '../../../types/feature-group';

export type SchematisedTagViewState = SchematisedTagEntity | null;

const schematisedTagView = createModel()({
  state: null as SchematisedTagViewState,
  reducers: {
    setData: (
      _: SchematisedTagViewState,
      payload: SchematisedTagViewState,
    ): SchematisedTagViewState => payload,
    clear: () => null,
  },
  effects: (dispatch) => ({
    get: async (name: string): Promise<void> => {
      const data = await SchematisedTagsService.getOne(name);

      const { description, properties, required } = JSON.parse(data.value);
      const mapped = {
        ...data,
        description: description,
        properties: properties,
        required: required,
      };

      dispatch.schematisedTagView.setData(mapped);
    },
    create: async ({ data }: { data: any }): Promise<any> => {
      await SchematisedTagsService.create(data);
    },
  }),
});

export default schematisedTagView;
