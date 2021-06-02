import { JobExecutions, Jobs } from '../../../../types/jobs';

export enum ExecutionsTypeSortOptions {
  ALL = 'all',
  FAILED = 'Failed',
  APP_MASTER_START_FAILED = 'Failed starting AM',
  INITIALIZING = 'Initializing',
  INITIALIZATION_FAILED = 'Initialization failed',
  FINISHED = 'Finished',
  RUNNING = 'Running',
  ACCEPTED = 'Accepted',
  NEW = 'New',
  KILLED = 'Killed',
  NEW_SAVING = 'New saving',
  SUBMITTED = 'Submitted',
  AGGREGATING_LOGS = 'Aggregating logs',
  FRAMEWORK_FAILURE = 'Framework failure',
  STARTING_APP_MASTER = 'Starting Application Master',
  GENERATING_SECURITY_MATERIAL = 'Generating security material',
  CONVERTING_NOTEBOOK = 'Converting noteboook to python',
}

export interface JobsExecutionContentProps {
  data?: Jobs;
  handleEdit: () => void;
  loadPrimaryExecutionsData: () => void;
  executionData?: JobExecutions;
  isLoading: boolean;
  onResetFilters?: () => void;
  handleRefreshData: () => void;
  handleDateChange: (data: { newStartDate?: Date; newEndDate?: Date }) => void;
  setEvent: (event: ExecutionsTypeSortOptions) => void;
  endDate?: Date;
  setEndDate: (date: Date) => void;
  startDate?: Date;
  event: any;
  setStartDate: (date: Date) => void;
  defaultFromDate: Date;
  defaultToDate: Date;
  creationDate?: any;
}

export interface Tab {}
