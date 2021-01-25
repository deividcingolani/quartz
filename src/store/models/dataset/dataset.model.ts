import { createModel } from '@rematch/core';
import DatasetService from '../../../services/project/DatasetService';
import { Dataset } from '../../../types/dataset';

export type DatasetState = Dataset[];

const dataset = createModel()({
  state: [] as DatasetState,
  reducers: {
    setData: (_: DatasetState, payload: DatasetState): DatasetState => payload,
    clear: (): DatasetState => [],
  },
  effects: (dispatch) => ({
    fetch: async ({ projectId }: { projectId: number }): Promise<void> => {
      const { data } = await DatasetService.getList(projectId);
      dispatch.dataset.setData(data.items || []);
    },
  }),
});

export default dataset;
