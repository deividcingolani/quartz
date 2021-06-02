import { Jobs } from '../../../types/jobs';

export const sourceFrom = {
  scratch: 'New job from scratch',
  existingJob: 'Import an existing job',
};

export enum JobType {
  'PYSPARK' = 'Python',
  'SPARK' = 'Spark',
  'FLINK' = 'Flink',
}

export enum JobEtc {
  'PYSPARK' = '.py',
  'SPARK' = '.jar',
  'FLINK' = '.xml',
}

export enum RuleTypes {
  PYSPARK = 'Python',
  SPARK = 'Spark',
  FLINK = 'Flink',
}

export enum DynamicAllocation {
  DYNAMIC = 'Dynamic',
  STATIC = 'Static',
}

export enum StrongRuleTypes {
  Python = 'PYSPARK',
  Spark = 'SPARK',
  Flink = 'FLINK',
}

export interface JobFormData {
  type: string;
  appName: string;
  defaultArgs: string;
  amMemory: number;
  amVCores: number;
  jobType: string;
  appPath: string;
  dynamicAllocation?: string;
  GPUs?: number;
  mainClass: string;
  'spark.executor.instances': number;
  'spark.executor.cores': number;
  'spark.executor.gpus': number;
  'spark*executor.memory': number;
  'spark.dynamicAllocation.enabled': string;
  'spark.dynamicAllocation.minExecutors': number;
  'spark.dynamicAllocation.maxExecutors': number;
  localResources: [];
  spark?: any;
}

export interface ArgumentsForRun {
  defaultArgs?: string;
}

export interface JobsFormProps {
  isLoading: boolean;
  isDisabled: boolean;
  submitHandler: (data: JobFormData, activeApp: any, additional: any) => void;
  onDelete?: () => void;
  isEdit?: boolean;
  initialData?: Jobs;
  fileName?: string;
}

export interface ActiveFile {
  type: string;
  href: string;
  zipState: string;
  attributes: {
    accessTime: string;
    dir: boolean;
    group: string;
    id: number;
    modificationTime: string;
    name: string;
    owner: string;
    parentId: number;
    path: string;
    permission: string;
    size: number;
    underConstruction: boolean;
  };
}
