import React, { FC } from 'react';
import { Box, Flex } from 'rebass';
import { Value } from '@logicalclocks/quartz';

import { getTimeLineOpacity } from './utils';
import { ActivityItem } from '../../types/feature-group';
import { JobExecutions } from '../../types/jobs';

export interface ActivityTimelineProps {
  items: ActivityItem | JobExecutions;
  hasData: {
    hasPrevious: boolean;
    hasFollowing: boolean;
  };
}

const blockHeight = 58; // 56px block height + 2px border
const lineHeight = 15;

const ActivityTimeline: FC<ActivityTimelineProps> = ({ items, hasData }) => {
  return (
    <Flex
      width="90px"
      mr="20px"
      flexDirection="column"
      mt={hasData.hasFollowing ? '-24px' : '22px'}
    >
      {hasData.hasFollowing && (
        <Box
          mb="10px"
          width="2px"
          height="36px"
          sx={{
            background:
              'linear-gradient(180deg, rgb(255,255,255) 0%, rgb(117,108,108) 100%)',
          }}
          ml="44px"
        />
      )}
      {Object.entries(items).map(([key, value], index) => {
        const hasNext = index !== Object.entries(items).length - 1;

        const height =
          blockHeight - lineHeight + (value.length - 1) * (blockHeight - 1); // block height without border-bottom
        const opacity =
          (hasNext &&
            getTimeLineOpacity(
              value[0].timestamp,
              Object.values(items)[index + 1][0].timestamp,
            )) ||
          1;

        return (
          <Flex alignItems="center" flexDirection="column" key={`date-${key}`}>
            <Value
              sx={{
                cursor: 'default',
              }}
            >
              {key}
            </Value>

            {hasNext && (
              <Box
                my="10px"
                width="2px"
                opacity={opacity}
                height={`${height}px`}
                backgroundColor="black"
              />
            )}
          </Flex>
        );
      })}
      {hasData.hasPrevious && (
        <Box
          mt="10px"
          width="2px"
          height="36px"
          sx={{
            background:
              'linear-gradient(0deg, rgb(255,255,255) 0%, rgb(117,108,108) 100%)',
          }}
          ml="44px"
        />
      )}
    </Flex>
  );
};

export default ActivityTimeline;
