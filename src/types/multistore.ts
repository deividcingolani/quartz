import { TeamMember } from './project';

export enum PermissionTypes {
  EDITABLE = 'EDITABLE',
  READ_ONLY = 'READ_ONLY',
  EDITABLE_BY_OWNERS = 'EDITABLE_BY_OWNERS',
}

export enum ShareableSevices {
  FEATURESTORE = 'FEATURESTORE',
  DATASET = 'DATASET',
}

export interface SharedProject {
  id: number;
  name: string;
  owner: string;
  accepted: string;
  permission: PermissionTypes;
  projectTeam: TeamMember[];
}
