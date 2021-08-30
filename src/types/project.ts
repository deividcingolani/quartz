import { User } from './user';

export interface TeamMemberPK {
  projectId: number;
  teamMember: string;
}

export interface TeamMember {
  project: Project;
  projectTeamPK: TeamMemberPK;
  teamRole: string;
  timestamp: string;
  user: User;
}

export interface Project {
  archived: boolean;
  conda: boolean;
  created: string;
  description: string;
  dockerImage: string;
  id: number;
  inode: any; // Todo: need to update
  kafkaMaxNumTopics: number;
  lastQuotaUpdate: string;
  logs: boolean;
  name: string;
  owner: string;
  paymentType: string;
  pythonVersion: string;
  retentionPeriod: string;
  user: User;
  projectName?: string;
  projectId?: number;
  projectTeam: TeamMember[];
  featureGroupsCount?: number;
  trainingDatasetsCount?: number;
  isOldDockerImage: boolean;
  opened: string; // only a frontend property.
}

export interface CrossUserProject {
  archived: boolean;
  created: string;
  description: string;
  dockerImage: string;
  id: number;
  inode: any;
  kafkaMaxNumTopics: number;
  lastQuotaUpdate: string;
  logs: boolean;
  name: string;
  owner: any;
  paymentType: string;
  pythonEnvironment: any;
  retentionPeriod: string;
}
