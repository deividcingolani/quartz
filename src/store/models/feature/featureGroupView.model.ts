import { createModel } from '@rematch/core';

// Types
import { FeatureGroup } from '../../../types/feature-group';
// Services
import FeatureGroupsService from '../../../services/project/FeatureGroupsService';
import TrainingDatasetService from '../../../services/project/TrainingDatasetService';

export type FeatureGroupViewState = FeatureGroup | null;

const featureGroupView = createModel()({
  state: null as FeatureGroupViewState,
  reducers: {
    setData: (
      _: FeatureGroupViewState,
      payload: FeatureGroup,
    ): FeatureGroupViewState => payload,
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

      const entries = provenance.items && provenance.items[0].out.entry;

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

      dispatch.featureGroupView.setData({
        ...data,
        provenance: fgProvenances,
      });
    },
  }),
});

export default featureGroupView;
