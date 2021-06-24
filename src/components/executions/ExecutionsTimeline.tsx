// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC } from 'react';
import { Box, Flex } from 'rebass';
import { Value } from '@logicalclocks/quartz';

import { getTimeLineOpacity } from '../activity/utils';
import { JobExecutions } from '../../types/jobs';

export interface ExecutionsTimelineProps {
  items: JobExecutions;
  hasData: {
    hasPrevious: boolean;
    hasFollowing: boolean;
  };
}

const blockHeight = 141; // 56px block height + 2px border
const lineHeight = 35;

const ExecutionsTimeline: FC<ExecutionsTimelineProps> = ({
  items,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
  hasData,
}) => {
  return (
    <Flex width="90px" mr="20px" flexDirection="column" mt="22px">
      {Object.entries(items).map(([key, value], index) => {
        const hasNext = index !== Object.entries(items).length - 1;

        const height = value.length * blockHeight - lineHeight; // block height without border-bottom

        const opacity =
          (hasNext &&
            getTimeLineOpacity(
              new Date(value[0].submissionTime).getTime(),
              new Date(
                Object.values(items)[index + 1][0].submissionTime,
              ).getTime(),
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
    </Flex>
  );
};

export default ExecutionsTimeline;
