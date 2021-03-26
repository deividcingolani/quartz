import React, { FC } from 'react';
import { Box, Flex } from 'rebass';
import { Microlabeling, Value } from '@logicalclocks/quartz';

export interface ResultProps {
  title: string;
  newCount: number;
  editedCount?: number;
  removedCount: number;
}

const Result: FC<ResultProps> = ({
  editedCount,
  newCount,
  removedCount,
  title,
}) => {
  return (
    <Box mr="20px">
      <Microlabeling mb="3px" gray>
        {title}
      </Microlabeling>
      <Flex>
        <Value>{!!newCount && `${newCount} new`}</Value>
        <Value>{!!removedCount && !!newCount && ', '}</Value>
        <Value>{!!removedCount && `${removedCount} removed`}</Value>
        <Value>
          {((!!removedCount && !!editedCount) ||
            (!!newCount && !!editedCount)) &&
            ', '}
        </Value>
        <Value>{!!editedCount && `${editedCount} edited`}</Value>
      </Flex>
    </Box>
  );
};

export default Result;
