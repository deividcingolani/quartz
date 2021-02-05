import { createModel } from '@rematch/core';
import { TrainingDataset } from '../../../types/training-dataset';
import { getNormalizedValue } from '../../../pages/project/feature-group/utils';
import TrainingDatasetService from '../../../services/project/TrainingDatasetService';
import { getValidPromisesValues } from '../search/deep-search.model';
import { TrainingDatasetLabelService } from '../../../services/project';

export type TrainingDatasetState = TrainingDataset[];

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
    await TrainingDatasetService.attachTag(
      projectId,
      featureStoreId,
      id,
      key,
      data,
    );
  }
};

export const trainingDatasetModel = createModel()({
  state: [] as TrainingDatasetState,
  reducers: {
    set: (
      _: TrainingDatasetState,
      payload: TrainingDataset[],
    ): TrainingDatasetState => payload,
    clear: (): TrainingDatasetState => [],
  },
  effects: (dispatch) => ({
    fetch: async ({
      projectId,
      featureStoreId,
    }: {
      projectId: number;
      featureStoreId: number;
    }): Promise<void> => {
      const data = await TrainingDatasetService.getList(
        +projectId,
        +featureStoreId,
      );

      dispatch.search.setTrainingDatasets(data);

      dispatch.trainingDatasets.set(
        data.map((dataset) => ({
          ...dataset,
          labels: [],
          updated: dataset.created,
          versions: data.map(({ version, id }) => ({ id, version })),
        })),
      );

      dispatch.trainingDatasets.fetchKeywordsAndLastUpdate({
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
      data: TrainingDataset[];
      projectId: number;
      featureStoreId: number;
    }): Promise<void> => {
      await Promise.allSettled(
        data.map(async (td) => {
          const readLast = await TrainingDatasetService.getWriteLast(
            projectId,
            featureStoreId,
            td.id,
          );
          const items = await new TrainingDatasetLabelService().getList(
            projectId,
            featureStoreId,
            td.id,
          );

          return {
            ...td,
            updated: readLast || td.created,
            labels: items,
            versions: data.map(({ version, id }) => ({ id, version })),
          };
        }),
      )
        .then((values) => getValidPromisesValues(values))
        .then((data) => dispatch.trainingDatasets.set(data));
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
      } = await TrainingDatasetService.create(projectId, featureStoreId, data);

      await TrainingDatasetService.attachKeywords(
        projectId,
        featureStoreId,
        id,
        data.keywords,
      );

      await attachTags(projectId, featureStoreId, id, data.tags);

      return id;
    },
    edit: async ({
      projectId,
      featureStoreId,
      trainingDatasetId,
      data,
      prevTagNames,
    }: {
      projectId: number;
      featureStoreId: number;
      trainingDatasetId: number;
      data: any;
      prevTagNames: string[];
    }): Promise<any> => {
      await TrainingDatasetService.edit(
        projectId,
        featureStoreId,
        trainingDatasetId,
        data,
      );

      const newTags = Object.keys(data.tags || {});

      const deletedTags = prevTagNames.filter(
        (name: string) => !newTags.includes(name),
      );

      await Promise.allSettled(
        deletedTags.map(async (name: string) => {
          await TrainingDatasetService.deleteTag(
            projectId,
            featureStoreId,
            trainingDatasetId,
            name,
          );
        }),
      );

      await TrainingDatasetService.attachKeywords(
        projectId,
        featureStoreId,
        trainingDatasetId,
        data.keywords,
      );

      await attachTags(projectId, featureStoreId, trainingDatasetId, data.tags);
    },
    delete: async ({
      projectId,
      featureStoreId,
      trainingDatasetId,
    }: {
      projectId: number;
      featureStoreId: number;
      trainingDatasetId: number;
    }): Promise<any> => {
      await TrainingDatasetService.delete(
        projectId,
        featureStoreId,
        trainingDatasetId,
      );
    },
  }),
});
