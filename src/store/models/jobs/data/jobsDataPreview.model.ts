import { createModel } from '@rematch/core';
import JobsService from '../../../../services/project/JobsService';
import { Jobs } from '../../../../types/jobs';

export type JobsDataPreviewState = Jobs[];

const jobsDataPreview = createModel()({
  state: [] as JobsDataPreviewState,
  reducers: {
    setData: (
      _: JobsDataPreviewState,
      payload: JobsDataPreviewState,
    ): JobsDataPreviewState => payload,
    clear: (): JobsDataPreviewState => [],
  },
  effects: (dispatch) => ({
    fetch: async ({ projectId }: { projectId: number }): Promise<void> => {
      const [items] = await JobsService.getList(projectId);

      dispatch.jobsRows.setData(items || []);
    },
  }),
});

export default jobsDataPreview;
