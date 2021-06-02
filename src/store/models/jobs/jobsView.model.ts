import { createModel } from '@rematch/core';
import JobsService from '../../../services/project/JobsService';
import { Jobs } from '../../../types/jobs';

export type JobsViewState = Jobs | null;

const jobsView = createModel()({
  state: null as JobsViewState,
  reducers: {
    setData: (_: JobsViewState, payload: JobsViewState): JobsViewState =>
      payload,
    clear: (): JobsViewState => null,
  },
  effects: (dispatch) => ({
    fetch: async ({
      projectId,
      jobsName,
    }: {
      projectId: number;
      jobsName: string;
    }): Promise<void> => {
      const data = await JobsService.getOneByName(projectId, jobsName);
      dispatch.jobsView.setData(data);
    },
  }),
});

export default jobsView;
