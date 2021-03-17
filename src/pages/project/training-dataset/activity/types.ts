import { Ref } from 'react';
import { ActivityItem } from '../../../../types/feature-group';
import { TrainingDataset } from '../../../../types/training-dataset';

export enum ActivityTypeSortOptions {
  'ALL' = 'all',
  'JOB' = 'job executions',
  'METADATA' = 'metadata updates',
  'STATISTICS' = 'new statistics',
}

export interface TrainingDatasetActivityContentProps {
  hasData: {
    hasMore: boolean;
    hasPrevious: boolean;
    hasFollowing: boolean;
  };
  endDate: Date;
  startDate: Date;
  isLoading: boolean;
  defaultToDate: Date;
  view: TrainingDataset;
  creationDate: string;
  defaultFromDate: Date;
  activity: ActivityItem;
  onResetFilters: () => void;
  handleRefreshData: () => void;
  event: ActivityTypeSortOptions;
  setEndDate: (date: Date) => void;
  loaderRef: Ref<HTMLButtonElement>;
  setStartDate: (date: Date) => void;
  handleLoadPreviousData: () => void;
  handleLoadFollowingData: () => void;
  setEvent: (event: ActivityTypeSortOptions) => void;
  handleDateChange: (data: { newStartDate?: Date; newEndDate?: Date }) => void;
}
