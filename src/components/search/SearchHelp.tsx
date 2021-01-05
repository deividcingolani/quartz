import { Flex } from 'rebass';
import React, { FC } from 'react';
import { Labeling } from '@logicalclocks/quartz';

const SearchHelp: FC = () => (
  <Flex
    mt="1px"
    height="35px"
    sx={{ bg: 'white' }}
    width="474px"
    alignItems="center"
  >
    <Labeling bold ml="10px">
      ↓
    </Labeling>
    <Labeling bold ml="2px">
      ↑
    </Labeling>

    <Labeling ml="5px" gray>
      to navigate
    </Labeling>

    <Labeling bold ml="5px">
      ↵
    </Labeling>

    <Labeling ml="5px" gray>
      to open page
    </Labeling>
  </Flex>
);

export default SearchHelp;
