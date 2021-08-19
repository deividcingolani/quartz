import { createModel } from '@rematch/core';
import { ProjectJobs } from '../../../types/jobs';
import JobsService from '../../../services/project/JobsService';

const jobs = createModel()({
  state: { projectId: 0, jobs: [], jobCount: 0 } as ProjectJobs,
  reducers: {
    set: (_: ProjectJobs, payload: ProjectJobs): ProjectJobs => {
      return payload;
    },
  },
  effects: (dispatch) => ({
    fetch: async ({
      projectId,
      limit,
      offset,
      sortBy,
      types,
      nameFilter,
      lastExecState,
    }: {
      projectId: number;
      limit: number;
      offset: number;
      sortBy: string | null;
      types: string[];
      nameFilter: string;
      lastExecState: string;
    }): Promise<void> => {
      const data = await JobsService.getList(
        projectId,
        limit,
        offset,
        sortBy,
        types,
        nameFilter,
        lastExecState,
      );
      dispatch.jobs.set({
        projectId,
        jobs: data.items || [],
        jobCount: data.count,
      });
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
