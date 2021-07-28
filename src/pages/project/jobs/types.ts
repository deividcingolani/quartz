import { Jobs, JobsConfig } from '../../../types/jobs';

export const sourceFrom = {
  scratch: 'New job from scratch',
  existingJob: 'Import an existing job',
};

export enum DynamicAllocation {
  DYNAMIC = 'Dynamic',
  STATIC = 'Static',
}

export enum FrameworkTypeUI {
  SPARK = 'SPARK',
  PYTHON = 'PYTHON',
  FLINK = 'FLINK',
}

export interface ArgumentsForRun {
  defaultArgs?: string;
}

export interface JobsFormProps {
  isLoading: boolean;
  isDisabled: boolean;
  submitHandler: (data: JobsConfig) => void;
  onDelete?: () => void;
  isEdit?: boolean;
  initialData?: Jobs;
  fileName?: string;
}

export interface ActiveFile {
  type: string;
  href: string;
  zipState: string;
  attributes: {
    accessTime: string;
    dir: boolean;
    group: string;
    id: number;
    modificationTime: string;
    name: string;
    owner: string;
    parentId: number;
    path: string;
    permission: string;
    size: number;
    underConstruction: boolean;
  };
}
