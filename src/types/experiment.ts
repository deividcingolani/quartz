import { ExecutionsTypeSortOptions } from '../pages/project/jobs/executions/types';

export interface Experiment {
  created: number;
  description: string;
  environment: string[];
  experimentId: string;
  experimentProjectName: string;
  href: string;
  id: string;
  metrics: { acc: string };
  name: string;
  program: string;
  type: string;
  userFullName: string;
  version: number;
  appId: string;
  experimentType: string;
  finished: number;
  function: string;
  jobName: string;
  model: string;
  modelProjectName: string;
  results: { count: number; href: string };
  started: number;
  state: ExecutionsTypeSortOptions;
  tensorboard: { href: string };
}
