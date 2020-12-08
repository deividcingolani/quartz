import { createModel } from '@rematch/core';
import { normalize, schema } from 'normalizr';
import { FeatureGroupStatistics } from '../../../../types/feature-group';
import FeatureGroupsService from '../../../../services/project/FeatureGroupsService';

export type FeatureGroupStatisticsState = {
  entities: {
    statistics: { [key: string]: FeatureGroupStatistics };
  };
  result: string[];
} | null;

const featureGroupStatisticsEntity = new schema.Entity<FeatureGroupStatistics>(
  'statistics',
  {},
  {
    idAttribute: 'column',
  },
);

const featureGroupStatistics = createModel()({
  state: null as FeatureGroupStatisticsState,
  reducers: {
    setData: (
      _: FeatureGroupStatisticsState,
      payload: FeatureGroupStatisticsState,
    ): FeatureGroupStatisticsState => payload,
    clear: (): FeatureGroupStatisticsState => null,
  },
  effects: (dispatch) => ({
    fetch: async ({
      projectId,
      featureStoreId,
      featureGroupId,
      timeCommit,
    }: {
      projectId: number;
      featureStoreId: number;
      featureGroupId: number;
      timeCommit?: string;
    }): Promise<void> => {
      const { data } = await FeatureGroupsService.getStatistics(
        projectId,
        featureStoreId,
        featureGroupId,
        timeCommit,
      );

      if (data.items) {
        const [item] = data.items;

        const contentData: {
          columns: FeatureGroupStatistics[];
        } = JSON.parse(item.content) as {
          columns: FeatureGroupStatistics[];
        };

        const normalizedData = normalize<FeatureGroupStatistics>(
          contentData.columns,
          [featureGroupStatisticsEntity],
        );

        dispatch.featureGroupRows.fetch({
          projectId,
          featureStoreId,
          featureGroupId,
        });
        dispatch.featureGroupStatistics.setData(normalizedData);
      }
    },
  }),
});

export default featureGroupStatistics;
