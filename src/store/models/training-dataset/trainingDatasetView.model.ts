import { createModel } from '@rematch/core';
import TrainingDatasetService from '../../../services/project/TrainingDatasetService';
import { TrainingDataset } from '../../../types/training-dataset';
import FeatureGroupsService from '../../../services/project/FeatureGroupsService';

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
        tdProvenances = tdProvenancesPromises.reduce((acc: any[], next) => {
          if (next.status === 'fulfilled') {
            return [...acc, next.value];
          }
          return acc;
        }, []);
      }

      dispatch.trainingDatasetView.setData({
        ...data,
        provenance: tdProvenances,
      });
    },
  }),
});

export default trainingDatasetView;
