import { createModel } from '@rematch/core';
import FeatureGroupsService from '../../../../services/project/FeatureGroupsService';
import { StorageConnectorType } from '../../../../types/feature-group-data-preview';

export type FeatureGroupDataPreviewState = { [key: string]: string[] };

const initialState: FeatureGroupDataPreviewState = {};

const featureGroupDataPreview = createModel()({
  state: initialState as FeatureGroupDataPreviewState,
  reducers: {
    setData: (
      _: FeatureGroupDataPreviewState,
      payload: FeatureGroupDataPreviewState,
    ): FeatureGroupDataPreviewState => payload,
    clear: (): FeatureGroupDataPreviewState => initialState,
  },
  effects: (dispatch) => ({
    fetch: async ({
      projectId,
      featureStoreId,
      featureGroupId,
      storage,
    }: {
      projectId: number;
      featureStoreId: number;
      featureGroupId: number;
      storage: StorageConnectorType;
    }): Promise<void> => {
      const { data } = await FeatureGroupsService.getRows(
        projectId,
        featureStoreId,
        featureGroupId,
        50,
        storage,
      );

      const features = await FeatureGroupsService.get(
        projectId,
        featureStoreId,
        featureGroupId,
      );

      dispatch.featureGroupView.setData(features);

      if (data.items) {
        const result: FeatureGroupDataPreviewState = data.items.reduce(
          (acc: FeatureGroupDataPreviewState, { row }) =>
            row.reduce(
              (rowAcc, { columnName, columnValue }) => ({
                ...rowAcc,
                [columnName]: [...(rowAcc[columnName] || []), columnValue],
              }),
              acc,
            ),
          {},
        );

        dispatch.featureGroupRows.setData(result);
      }
    },
  }),
});

export default featureGroupDataPreview;
