import { createModel } from '@rematch/core';
import FeatureGroupsService from '../../../../services/project/FeatureGroupsService';

export type FeatureGroupRowsState = { [key: string]: string[] };

const initialState: FeatureGroupRowsState = {};

const featureGroupRows = createModel()({
  state: initialState as FeatureGroupRowsState,
  reducers: {
    setData: (
      _: FeatureGroupRowsState,
      payload: FeatureGroupRowsState,
    ): FeatureGroupRowsState => payload,
    clear: (): FeatureGroupRowsState => initialState,
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
      const { data } = await FeatureGroupsService.getRows(
        projectId,
        featureStoreId,
        featureGroupId,
      );

      if (data.items) {
        const result: FeatureGroupRowsState = data.items.reduce(
          (acc: FeatureGroupRowsState, { row }) =>
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

export default featureGroupRows;
