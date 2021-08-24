import { JobsConfig } from './jobs';
import { Project } from './project';
import { User } from './user';

export interface JupyterState {
  runningServer: RunningServer | false | null;
  runningApplications: RunningApplication[] | false | null;
  environment: EnvironmentState | null;
  settings: JupyterSettings | null;
}

export interface EnvironmentState {
  isReady: boolean;
  missingLibraries: string[];
}

export interface JupyterSettings {
  advanced: boolean;
  baseDir: string;
  dockerConfig: DockerConfig;
  gitAvailable: boolean;
  gitBackend: boolean;
  jobConfig: JobsConfig;
  jupyterSettingsPK: JupyterSettingsPK;
  mode: string;
  privateDir: string;
  project: Project;
  pythonKernel: boolean;
  secret: string;
  shutdownLevel: number | string;
  users: User;
  // Entries that exist in Jobs but not here.
  config: null;
  name: null;
}

export interface DockerConfig {
  type: string;
  resourceConfig: ResourceConfig;
  logRedirection: boolean;
  jobType: string;
}

export interface ResourceConfig {
  cores: number;
  memory: number;
  gpus: number;
}

export interface JupyterSettingsPK {
  email: string;
  projectid: number;
}

export interface RunningServer {
  cid: string;
  created: string;
  expires: string;
  hdfsuserid: number;
  minutesUntilExpiration: number;
  port: number;
  projectId: Project;
  secret: string;
  token: string;
  runningApplications: any | null;
  hasEnvironment: boolean;
}

export interface Library {
  type: string;
  href: string;
  channel: string;
  commands: { href: string };
  library: string;
  packageSource: string;
  preinstalled: string;
  version: string;
}

export interface RunningApplication {
  appId: string;
  id: number;
  kind: string;
  monitoring: AppMonitoring;
  owner: string;
  proxyUser: string;
  state: string;
}

export interface AppMonitoring {
  grafanaUrl: string;
  kibanaUrl: string;
  sparkUrl: string;
  tfUrl: string;
  yarnUrl: string;
}

export interface ElasticToken {
  kibanaUrl: string;
  projectName: string;
  token: string;
}
