import { createModel } from '@rematch/core';
import JobsService from '../../../../services/project/JobsService';
import { JobExecutions } from '../../../../types/jobs';
import { format } from 'date-fns';
import { ExecutionsTypeSortOptions } from '../../../../pages/project/jobs/executions/types';

export type JobsViewExecutions = JobExecutions | null;

export interface ExecutionsFetchParams {
  projectId: number;
  jobsName: string;
  eventType: ExecutionsTypeSortOptions;
  isSorting?: boolean;
  timeOptions?: {
    from?: number;
    to?: number;
  };
  offsetOptions?: {
    limit?: number;
    offset: number;
  };
  sortType?: 'asc' | 'desc';
}

export interface ExecutionLogs {
  projectId: number;
  jobName: string;
  executionId: number;
  logsType: string;
}

const mapData = (payload: JobsViewExecutions, beginValue = {}) => {
  if (payload && payload.items) {
    const data = payload.items.reduce(
      (acc: { [time: string]: JobsViewExecutions[] }, item) => {
        const stringDate = format(new Date(item.submissionTime), 'dd MMM. y');
        if (!acc[stringDate]) {
          acc[stringDate] = [];
        }

        acc[stringDate].push(item);

        return acc;
      },
      beginValue,
    );
    return Object.keys(data).reduce((acc, key) => {
      return {
        ...acc,
        [key]: data[key].sort(
          (itemA: any, itemB: any) =>
            -Math.sign(itemA.submissionTime - itemB.submissionTime),
        ),
      };
    }, {});
  }
  return null;
};

const jobsExecutions = createModel()({
  state: null as JobsViewExecutions,
  reducers: {
    setData: (
      _: JobsViewExecutions,
      payload: JobsViewExecutions,
    ): JobsViewExecutions => payload,
    clear: (): JobsViewExecutions => null,
  },
  effects: (dispatch) => ({
    fetch: async ({
      projectId,
      jobsName,
      eventType,
      timeOptions,
      offsetOptions,
      sortType,
      isSorting = true,
    }: ExecutionsFetchParams): Promise<void> => {
      const data = await JobsService.getExecutions(
        projectId,
        jobsName,
        eventType,
        timeOptions,
        offsetOptions,
        sortType,
      );
      //@ts-ignore
      const groupedItems = isSorting ? mapData(data) : data;

      dispatch.jobsExecutions.setData(groupedItems);
    },
    logs: async ({
      projectId,
      jobName,
      executionId,
      logsType,
    }: ExecutionLogs): Promise<void> => {
      const data = await JobsService.getExecutionsLogs(
        projectId,
        jobName,
        executionId,
        logsType,
      );
      return data;
    },
  }),
});

export default jobsExecutions;
