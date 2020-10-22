import { User } from './user';

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
  owner: User; // Todo: need to update
  paymentType: string;
  pythonVersion: string;
  retentionPeriod: string;
  user: User;
}
