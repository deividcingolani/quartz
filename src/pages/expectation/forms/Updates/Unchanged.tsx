import React, { FC } from 'react';
import { Box, Flex } from 'rebass';
import { Microlabeling, Value } from '@logicalclocks/quartz';

export interface UnchangedProps {
  title: string;
}

const Unchanged: FC<UnchangedProps> = ({ title }) => {
  return (
    <Box mr="20px">
      <Microlabeling mb="3px" gray>
        {title}
      </Microlabeling>
      <Flex>
        <Value>unchanged</Value>
      </Flex>
    </Box>
  );
};

export default Unchanged;
