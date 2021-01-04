import { createModel } from '@rematch/core';

// Types
import { FeatureGroup } from '../../../types/feature-group';
// Services
import FeatureGroupsService from '../../../services/project/FeatureGroupsService';
import TrainingDatasetService from '../../../services/project/TrainingDatasetService';
import FeatureGroupLabelsService from '../../../services/project/FeatureGroupLabelsService';

export type FeatureGroupViewState = FeatureGroup | null;

const featureGroupView = createModel()({
  state: null as FeatureGroupViewState,
  reducers: {
    setData: (
      _: FeatureGroupViewState,
      payload: FeatureGroup,
    ): FeatureGroupViewState => payload,
    setLabels: (state: FeatureGroupViewState, payload: string[]): any => ({
      ...state,
      labels: payload,
    }),
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

      const { data: provenance } = await FeatureGroupsService.getProvenance(
        projectId,
        featureStoreId,
        data,
      );

      let keywords: string[] = [];
      if (data.type === 'cachedFeaturegroupDTO') {
        keywords = await FeatureGroupLabelsService.getList(
          projectId,
          featureStoreId,
          featureGroupId,
        );
      }

      const entries =
        provenance.items && provenance.items.map(({ out }) => out.entry[0]);

      let fgProvenances = [];

      if (entries) {
        dispatch.project.getProject(projectId);

        const fgProvenancesPromises = await Promise.allSettled(
          entries.map(async (entry) => {
            const { key } = entry;
            const [td] = await TrainingDatasetService.getOneByName(
              projectId,
              featureStoreId,
              key.slice(0, key.lastIndexOf('_')),
            );
            return {
              td,
              info: entry,
            };
          }),
        );
        fgProvenances = fgProvenancesPromises.reduce((acc: any[], next) => {
          if (next.status === 'fulfilled') {
            return [...acc, next.value];
          }
          return acc;
        }, []);
      }

      data.type === 'cachedFeaturegroupDTO' &&
        dispatch.featureGroupLabels.fetch({
          projectId,
          featureStoreId,
          featureGroupId,
        });

      const { data: tags } = await FeatureGroupsService.getTags(
        projectId,
        featureStoreId,
        featureGroupId,
      );

      const mappedTags = tags?.items?.map(({ name, value, schema }: any) => {
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

      dispatch.featureGroupView.setData({
        ...data,
        provenance: fgProvenances,
        labels: keywords,
        tags: mappedTags || [],
      });
    },
    updateLabels: ({ labels }: { labels: string[] }) => {
      dispatch.featureGroupView.setLabels(labels);
    },
  }),
});

export interface SchemaType {
  properties: {
    [key: string]: {
      type: string;
      items: {
        type: string;
      };
    };
  };
}

export default featureGroupView;
