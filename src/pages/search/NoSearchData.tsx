import { Flex } from 'rebass';
import React, { FC } from 'react';
import { Subtitle } from '@logicalclocks/quartz';

export interface FeatureGroupsListProps {
  subject: string;
}

const NoSearchData: FC<FeatureGroupsListProps> = ({ subject }) => {
  return (
    <Flex
      justifyContent="center"
      height="calc(100vh - 195px)"
      alignItems="center"
      width="100%"
    >
      <Subtitle>{`0 ${subject} match with the filters`}</Subtitle>
    </Flex>
  );
};

export default NoSearchData;
