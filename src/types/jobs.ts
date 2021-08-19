export enum JobType {
  PYSPARK = 'PYSPARK',
  SPARK = 'SPARK',
  FLINK = 'FLINK',
  PYTHON = 'PYTHON',
  DOCKER = 'DOCKER',
}

export enum FrameworkType {
  SPARK = 'sparkJobConfiguration',
  PYTHON = 'pythonJobConfiguration',
}

export interface ProjectJobs {
  jobs: Jobs[];
  projectId: number;
  jobCount: number;
}

export interface Jobs {
  id: number;
  items: Jobs[];
  defaultValue: string | number;
  defaultArgs: string;
  creationTime: string;
  lastRun: string;
  description: string;
  name: string;
  jobType: JobType;
  type: FrameworkType;
  projectId: number;
  executions: any;
  config: JobsConfig;
  submissionTime: string;
}

export interface JobExecutions {
  items: JobExecutions[];
  name?: string;
  id: number;
  defaultValue?: string | number;
  creationTime?: string;
  lastRun?: string;
  index?: number;
  creator: {
    email?: string;
    firstName?: string;
    lastName?: string;
    userName?: string;
  };
  user?: {
    email?: string;
    firstName?: string;
    lastName?: string;
    userName?: string;
  };
  submissionTime: string;
  type: string;
  jobType: string;
  config: JobsConfig;
}

export interface JobExecutionData {
  appId: string;
  args: string;
  duration: number;
  filesToRemove: any[];
  finalStatus: string;
  hdfsUser: string;
  href: string;
  id: number;
  progress: number;
  state: string;
  stderrPath: string;
  stdoutPath: string;
  submissionTime: string;
  type: string;
  user: {
    href: string;
  };
}

export interface PythonResourceConfig {
  cores: number;
  memory: number;
}

export interface JobsConfig {
  appName: string;
  appPath: string;
  jobType: JobType;
  mainClass: string;
  type: FrameworkType;
  defaultArgs?: string;
  // spark
  amVCores: number;
  amMemory: number;
  'spark.executor.memory': number;
  'spark.executor.cores': number;
  'spark.executor.enabled': boolean;
  'spark.executor.instances': number;
  'spark.executor.gpus': number;
  'spark.blacklist.enabled': boolean;
  'spark.dynamicAllocation.enabled': boolean;
  'spark.dynamicAllocation.initialExecutors': number;
  'spark.dynamicAllocation.maxExecutors': number;
  'spark.dynamicAllocation.minExecutors': number;
  'spark.yarn.dist.pyFiles': string;
  'spark.yarn.dist.jars': string;
  'spark.yarn.dist.files': string;
  'spark.yarn.dist.archives': string;
  properties: string;
  // python and docker
  resourceConfig: PythonResourceConfig;
  files: string;
}

export interface JobsDownloadFile {
  token?: string;
  urlEncodePath?: string;
  data?: any;
  type?: string;
}

export interface JobsRowItem {
  items: Jobs[];
}
