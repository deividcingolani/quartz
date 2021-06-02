import { DataEntity } from '.';
import { User } from './user';
import { Expectation } from './expectation';
import { ActivityType } from './feature-group';

export enum JobsType {
  spark = 'SPARK',
  python = 'PYSPARK',
  flink = 'FLINK',
}

export interface Jobs extends DataEntity {
  items: Jobs[];
  defaultValue: string | number;
  defaultArgs: string;
  creationTime: string;
  lastRun: string;
  description: string;
  name: string;
  partition: boolean;
  primary: boolean;
  jobType: JobsType;
  onlineType?: JobsType;
  label: boolean;
  index: number;
  version: number;
  parentProjectName: string;
  parentProjectId: number;
  featurestoreId: number;
  matchText: string;
  highlights: any;
  featureId: number;
  projectId: number;
  executions: any;
  email: string;
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

export interface Property {
  [key: string]: string;
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

export interface JobsConfig {
  amMemory: number;
  appName: string;
  appPath: string;
  jobType: JobsType;
  mainClass: string;
  amVCores: number;
  type: string;
  defaultArgs?: string;
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
  'spark.yarn.dist.pyFiles': string[];
  'spark.yarn.dist.jars': string[];
  'spark.yarn.dist.files': string[];
  'spark.yarn.dist.archives': string[];
}

export interface JobsDownloadFile {
  token?: string;
  urlEncodePath?: string;
  data?: any;
  type?: string;
}

export interface ActivityItemData {
  type: ActivityType;
  timestamp: number;
  href: string;
  user: User;
  metadata: string;
  statistics: {
    commitTime: string;
    href: string;
  };
  executions: {
    href: string;
    finalStatus: string;
    id: number;
  };
  commit: {
    commitDateString: string;
    commitID: number;
    commitTime: number;
    href: string;
    rowsDeleted: number;
    rowsInserted: number;
    rowsUpdated: number;
  };
  validations: {
    expectationResults: {
      expectation: Expectation;
      results: {
        feature: string;
        message: string;
        rule: any;
        status: string;
        value: string;
      }[];
      status: string;
    }[];
  };
}

export interface JobsRowItem {
  items: Jobs[];
}

export interface JobsStorageConnector {
  arguments: string;
  connectionString?: string;
  hopsfsPath?: string;
  description: string;
  featurestoreId: number;
  id: number;
  name: string;
  bucket?: string;
  storageConnectorType: JobsType;
  accessKey?: string;
  secretKey?: string;
}
