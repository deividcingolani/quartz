export interface Job {
  jobId: number;
  jobName: string;
  lastComputed: string;
  jobStatus: 'Succeeded' | 'Failed' | 'Running';
  featurestoreId: number;
  featuregroupId: number;
}
