import { User } from './user';
import { ClusterStates } from '../pages/project/integrations/ClusterRow';

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
