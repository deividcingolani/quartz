// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC } from 'react';
import { Flex } from 'rebass';
import ActivityDataItem from './ActivityItem';
import ActivityTimeline from './ActivityTimeline';
import { ActivityItem, ActivityType } from '../../types/feature-group';
import { JobExecutions } from '../../types/jobs';

export interface ActivityProps {
  items: ActivityItem | JobExecutions;
  actions?: Map<ActivityType, (data?: any) => void>;
  hasData: {
    hasPrevious: boolean;
    hasFollowing: boolean;
  };
}

const Activity: FC<ActivityProps> = ({ items, actions, hasData }) => {
  return (
    <Flex>
      <ActivityTimeline hasData={hasData} items={items} />

      <Flex flex={1} flexDirection="column">
        {Object.entries(items).map(([key, value]) => {
          return (
            <ActivityDataItem
              actions={actions}
              activities={value}
              key={`item-${key}`}
            />
          );
        })}
      </Flex>
    </Flex>
  );
};

export default Activity;
