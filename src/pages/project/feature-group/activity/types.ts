import { ActivityItem, FeatureGroup } from '../../../../types/feature-group';
import { Ref } from 'react';

export enum ActivityTypeSortOptions {
  'ALL' = 'all',
  'JOB' = 'job executions',
  'COMMIT' = 'data ingestions',
  'METADATA' = 'metadata updates',
  'STATISTICS' = 'new statistics',
}

export interface FeatureGroupActivityContentProps {
  hasData: {
    hasMore: boolean;
    hasPrevious: boolean;
    hasFollowing: boolean;
  };
  endDate: Date;
  startDate: Date;
  isLoading: boolean;
  view: FeatureGroup;
  creationDate: string;
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
