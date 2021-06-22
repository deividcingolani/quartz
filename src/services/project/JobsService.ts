import BaseApiService, { RequestType } from '../BaseApiService';
import { format } from 'date-fns';
// Types
import { JobExecutions, Jobs } from '../../types/jobs';
import { ExecutionsTypeSortOptions } from '../../pages/project/jobs/executions/types';

export const getExpandParam = (): string => {
  return `expand=user`;
};

export const getTimeParam = (timeProps?: {
  from?: number;
  to?: number;
}): string => {
  if (!timeProps) {
    return '';
  }

  const { from, to } = timeProps;

  return `${
    from
      ? `&filter_by=submissiontime_gt:${format(
          new Date(from),
          "yyyy-MM-dd'T'HH:mm:ss.SSSX",
        )}`
      : ''
  }&${
    to
      ? `filter_by=submissiontime_lt:${format(
          new Date(to),
          "yyyy-MM-dd'T'HH:mm:ss.SSSX",
        )}`
      : ''
  }`;
};

export const getOffsetParam = (offsetProps?: {
  offset: number;
  limit?: number;
}): string => {
  if (!offsetProps) {
    return '';
  }

  const { offset, limit = 5 } = offsetProps;

  return `&limit=${limit}&offset=${offset}`;
};

export const getSortByTime = (sortType: string) => {
  return `&sort_by=submissiontime:${sortType}`;
};

export const getSortParam = (eventType: ExecutionsTypeSortOptions): string => {
  const sortMap = new Map<ExecutionsTypeSortOptions, string>([
    [ExecutionsTypeSortOptions.ALL, ''],
    [ExecutionsTypeSortOptions.FAILED, '&filter_by=state:FAILED'],
    [ExecutionsTypeSortOptions.KILLED, '&filter_by=state:KILLED'],
    [ExecutionsTypeSortOptions.INITIALIZING, '&filter_by=state:INITIALIZING'],
    [
      ExecutionsTypeSortOptions.INITIALIZATION_FAILED,
      '&filter_by=state:INITIALIZATION_FAILED',
    ],
    [ExecutionsTypeSortOptions.FINISHED, '&filter_by=state:FINISHED'],
    [ExecutionsTypeSortOptions.RUNNING, '&filter_by=state:RUNNING'],
    [ExecutionsTypeSortOptions.ACCEPTED, '&filter_by=state:ACCEPTED'],
    [ExecutionsTypeSortOptions.NEW, '&filter_by=state:NEW'],
    [ExecutionsTypeSortOptions.NEW_SAVING, '&filter_by=state:NEW_SAVING'],
    [ExecutionsTypeSortOptions.SUBMITTED, '&filter_by=state:SUBMITTED'],
    [
      ExecutionsTypeSortOptions.AGGREGATING_LOGS,
      '&filter_by=state:AGGREGATING_LOGS',
    ],
    [
      ExecutionsTypeSortOptions.FRAMEWORK_FAILURE,
      '&filter_by=state:FRAMEWORK_FAILURE',
    ],
    [
      ExecutionsTypeSortOptions.STARTING_APP_MASTER,
      '&filter_by=state:STARTING_APP_MASTER',
    ],
    [
      ExecutionsTypeSortOptions.APP_MASTER_START_FAILED,
      '&filter_by=state:APP_MASTER_START_FAILED',
    ],
    [
      ExecutionsTypeSortOptions.GENERATING_SECURITY_MATERIAL,
      '&filter_by=state:GENERATING_SECURITY_MATERIAL',
    ],
    [
      ExecutionsTypeSortOptions.CONVERTING_NOTEBOOK,
      '&filter_by=state:CONVERTING_NOTEBOOK',
    ],
  ]);

  return sortMap.get(eventType) || '';
};

class JobsService extends BaseApiService {
  getList = async (projectId: number): Promise<any> => {
    const { data } = await this.request<void>({
      url: `${projectId}/jobs?sort_by=submissiontime:desc&expand=creator&limit=20&offset=0&expand=executions(sort_by=submissiontime:desc)`,
      type: RequestType.get,
    });

    return data;
  };

  getOneByName = async (
    projectId: number,
    jobsName: string,
  ): Promise<Jobs[]> => {
    const { data } = await this.request<Jobs[]>({
      url: `${projectId}/jobs/${jobsName}?expand=creator&expand=executions`,
      type: RequestType.get,
    });
    return data;
  };

  getExecutions = async (
    projectId: number,
    jobsName: string,
    eventType: ExecutionsTypeSortOptions,
    timeOptions?: {
      from?: number;
      to?: number;
    },
    offsetOptions?: {
      offset: number;
      limit?: number;
    },
    sortType: 'asc' | 'desc' = 'desc',
  ): Promise<JobExecutions[]> => {
    const { data } = await this.request<JobExecutions[]>({
      url: `${projectId}/jobs/${jobsName}/executions?${getExpandParam()}${getOffsetParam(
        offsetOptions,
      )}${getSortByTime(sortType)}${getTimeParam(timeOptions)}${getSortParam(
        eventType,
      )}`,
      type: RequestType.get,
    });
    return data;
  };

  getExecutionsLogs = async (
    projectId: number,
    jobName: string,
    executionId: number,
    logsType: string,
  ): Promise<any> => {
    return this.request<any>({
      type: RequestType.get,
      url: `${projectId}/jobs/${jobName}/executions/${executionId}/log/${logsType}`,
    });
  };

  new = (projectId: number, data: any) => {
    return this.request<any>({
      type: RequestType.put,
      url: `${projectId}/jobs/new`,
      data,
    });
  };

  update = (projectId: number, data: any, oldName: string) => {
    return this.request<any>({
      type: RequestType.put,
      url: `${projectId}/jobs/${oldName}`,
      data,
    });
  };

  copy = (projectId: number, data: any) =>
    this.request<any>({
      type: RequestType.put,
      url: `${projectId}/jobs/${data.appName}`,
      data,
    });

  run = async (data: string, projectId: number, jobsName: string) => {
    const res = await this.request<any>({
      type: RequestType.post,
      headers: { 'Content-Type': 'text/plain' },
      url: `${projectId}/jobs/${jobsName}/executions`,
      data,
    });
    return res;
  };

  stop = async (projectId: number, jobsName: string, executionId: number) => {
    const res = await this.request<any>({
      type: RequestType.delete,
      url: `${projectId}/jobs/${jobsName}/executions/${executionId}`,
    });
    return res;
  };
}

export default new JobsService('/project');
