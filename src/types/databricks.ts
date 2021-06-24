import { TeamMember } from './project';
import { User } from './user';

export interface ClusterRowProps {
  cluster: Cluster;
  members: TeamMember[];
  databricks: Databricks;
}

export enum ClusterStates {
  'PENDING' = 'PENDING',
  'RUNNING' = 'RUNNING',
  'TERMINATED' = 'TERMINATED',
}

export interface Databricks {
  url: string;
  clusters: Cluster[];
}

export interface Cluster {
  id: string;
  user?: User;
  href: string;
  name: string;
  project?: string;
  state: ClusterStates;
}
