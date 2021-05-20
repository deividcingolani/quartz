import { Project } from './project';

export enum SecretsVisibility {
  private = 'Private',
  project = 'Project',
}

export interface Secret {
  name: string;
  secret: string;
  visibility: SecretsVisibility;
  project?: Project;

  addedOn: string;
  scope: string;
  owner: string;
}
