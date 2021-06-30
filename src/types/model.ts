export interface Model {
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
}
