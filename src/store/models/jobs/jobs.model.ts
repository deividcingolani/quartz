import { createModel } from '@rematch/core';
import { Jobs, ProjectJobs } from '../../../types/jobs';
import JobsService from '../../../services/project/JobsService';

export type JobsState = ProjectJobs;

const jobs = createModel()({
  state: { projectId: 0, jobs: [] } as ProjectJobs,
  reducers: {
    set: (_: JobsState, projectId: number, payload: Jobs[]): JobsState => {
      return { jobs: payload, projectId };
    },
  },
  effects: (dispatch) => ({
    fetch: async ({ projectId }: { projectId: number }): Promise<void> => {
      const data = await JobsService.getList(projectId);
      dispatch.jobs.set(projectId, data.items || []);
    },
    run: async ({
      argumentsData,
      projectId,
      jobName,
    }: {
      argumentsData: any;
      projectId: number;
      jobName: string;
    }): Promise<any> => {
      const res = await JobsService.run(argumentsData, projectId, jobName);
      return res;
    },
    stop: async ({
      projectId,
      jobName,
      executionId,
    }: {
      projectId: number;
      jobName: string;
      executionId: number;
    }): Promise<any> => {
      const res = await JobsService.stop(projectId, jobName, executionId);
      return res;
    },
    create: async ({
      projectId,
      data,
    }: {
      projectId: number;
      data: any;
    }): Promise<number> => {
      const {
        data: { id },
      } = await JobsService.new(projectId, data);

      return id;
    },
    update: async ({
      projectId,
      data,
      oldName,
    }: {
      projectId: number;
      data: any;
      oldName: string;
    }): Promise<number> => {
      const {
        data: { id },
      } = await JobsService.update(projectId, data, oldName);

      return id;
    },
  }),
});

export default jobs;
