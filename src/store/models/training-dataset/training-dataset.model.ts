import { createModel } from '@rematch/core';
import { TrainingDataset } from '../../../types/training-dataset';
import { getNormalizedValue } from '../../../pages/project/feature-group/utils';
import TrainingDatasetService from '../../../services/project/TrainingDatasetService';

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

      // Fetch last updated time for each training dataset
      const dssPromises = await Promise.allSettled(
        data.map(async (group) => {
          const readLast = await TrainingDatasetService.getWriteLast(
            projectId,
            featureStoreId,
            group.id,
          );
          return {
            ...group,
            updated: readLast || group.created,
          };
        }),
      );

      data.forEach(({ id }) => {
        dispatch.trainingDatasetLabels.fetch({
          projectId,
          featureStoreId,
          trainingDatasetId: id,
        });
      });

      const datasets = dssPromises.reduce((acc: TrainingDataset[], next) => {
        if (next.status === 'fulfilled') {
          return [...acc, next.value];
        }
        return acc;
      }, []);

      dispatch.trainingDatasets.set(datasets);
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
  }),
});
