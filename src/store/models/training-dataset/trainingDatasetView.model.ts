import { createModel } from '@rematch/core';
import TrainingDatasetService from '../../../services/project/TrainingDatasetService';
import { TrainingDataset } from '../../../types/training-dataset';
import { SchemaType } from '../feature/featureGroupView.model';
import { TrainingDatasetLabelService } from '../../../services/project';
import { ProvenanceState } from '../../../components/provenance/types';

export type TrainingDatasetViewState = TrainingDataset | null;

const trainingDatasetView = createModel()({
  state: null as TrainingDatasetViewState,
  reducers: {
    setData: (
      _: TrainingDatasetViewState,
      payload: TrainingDataset,
    ): TrainingDatasetViewState => payload,
    clear: () => null,
    setLabels: (state: TrainingDatasetViewState, payload: string[]): any => ({
      ...state,
      labels: payload,
    }),
  },
  effects: (dispatch) => ({
    fetch: async ({
      projectId,
      featureStoreId,
      trainingDatasetId,
      needProvenance = true,
    }: {
      projectId: number;
      featureStoreId: number;
      trainingDatasetId: number;
      needProvenance?: boolean;
    }): Promise<void> => {
      const data = await TrainingDatasetService.get(
        projectId,
        featureStoreId,
        trainingDatasetId,
      );

      dispatch.trainingDatasetView.setData({
        ...data,
        provenance: {} as ProvenanceState,
        versions: [{ id: data.id, version: data.version }],
        tags: [],
        labels: [],
      });

      dispatch.trainingDatasetView.loadRemainingData({
        data,
        projectId,
        featureStoreId,
        trainingDatasetId,
        needProvenance,
      });
    },
    loadRemainingData: async ({
      projectId,
      featureStoreId,
      trainingDatasetId,
      data,
      needProvenance,
    }: {
      data: TrainingDataset;
      projectId: number;
      featureStoreId: number;
      trainingDatasetId: number;
      needProvenance: boolean;
    }): Promise<void> => {
      let provenance: ProvenanceState = {} as ProvenanceState;
      if (needProvenance) {
        provenance = await dispatch.provenance.fetch({
          projectId,
          featureStoreId,
          data,
        });
      }

      const tdsWithSameName = await TrainingDatasetService.getOneByName(
        projectId,
        data.name,
        featureStoreId,
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
        provenance,
        versions: tdsWithSameName.map(({ id, version }) => ({ id, version })),
        tags: mappedTags || [],
        labels: keywords,
      });
    },
  }),
});

export default trainingDatasetView;
