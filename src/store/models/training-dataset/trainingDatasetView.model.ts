import { createModel } from '@rematch/core';
import TrainingDatasetService from '../../../services/project/TrainingDatasetService';
import { TrainingDataset } from '../../../types/training-dataset';
import FeatureGroupsService from '../../../services/project/FeatureGroupsService';
import { SchemaType } from '../feature/featureGroupView.model';
import { TrainingDatasetLabelService } from '../../../services/project';
import { getValidPromisesValues } from '../search/deep-search.model';

export type TrainingDatasetViewState = TrainingDataset | null;

const trainingDatasetView = createModel()({
  state: null as TrainingDatasetViewState,
  reducers: {
    setData: (
      _: TrainingDatasetViewState,
      payload: TrainingDataset,
    ): TrainingDatasetViewState => payload,
    clear: () => null,
  },
  effects: (dispatch) => ({
    fetch: async ({
      projectId,
      featureStoreId,
      trainingDatasetId,
    }: {
      projectId: number;
      featureStoreId: number;
      trainingDatasetId: number;
    }): Promise<void> => {
      const data = await TrainingDatasetService.get(
        projectId,
        featureStoreId,
        trainingDatasetId,
      );

      dispatch.trainingDatasetView.setData({
        ...data,
        provenance: [],
        versions: [{ id: data.id, version: data.version }],
        tags: [],
        labels: [],
      });

      dispatch.trainingDatasetView.loadRemainingData({
        data,
        projectId,
        featureStoreId,
        trainingDatasetId,
      });
    },
    loadRemainingData: async ({
      projectId,
      featureStoreId,
      trainingDatasetId,
      data,
    }: {
      data: TrainingDataset;
      projectId: number;
      featureStoreId: number;
      trainingDatasetId: number;
    }): Promise<void> => {
      const { data: provenance } = await TrainingDatasetService.getProvenance(
        projectId,
        featureStoreId,
        data,
      );

      const entries = provenance.items && provenance.items[0].in.entry;

      let tdProvenances = [];

      if (entries) {
        dispatch.project.getProject(projectId);

        const tdProvenancesPromises = await Promise.allSettled(
          entries.map(async (entry) => {
            const { key } = entry;
            const [fg] = await FeatureGroupsService.getOneByName(
              projectId,
              featureStoreId,
              key.slice(0, key.lastIndexOf('_')),
            );
            return {
              fg,
              info: entry,
            };
          }),
        );
        tdProvenances = getValidPromisesValues(tdProvenancesPromises);
      }

      const tdsWithSameName = await TrainingDatasetService.getOneByName(
        projectId,
        featureStoreId,
        data.name,
      );

      const { data: tags } = await TrainingDatasetService.getTags(
        projectId,
        featureStoreId,
        trainingDatasetId,
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

      const keywords =
        (await new TrainingDatasetLabelService().getList(
          projectId,
          featureStoreId,
          trainingDatasetId,
        )) || [];

      dispatch.trainingDatasetView.setData({
        ...data,
        provenance: tdProvenances,
        versions: tdsWithSameName.map(({ id, version }) => ({ id, version })),
        tags: mappedTags || [],
        labels: keywords,
      });
    },
  }),
});

export default trainingDatasetView;
