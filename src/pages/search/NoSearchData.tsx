// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC } from 'react';
import { Flex } from 'rebass';
import { Subtitle } from '@logicalclocks/quartz';

export interface FeatureGroupsListProps {
  subject: string;
}

const NoSearchData: FC<FeatureGroupsListProps> = ({ subject }) => {
  return (
    <Flex justifyContent="center" alignItems="center" width="100%">
      <Subtitle>{`0 ${subject} match with the filters`}</Subtitle>
    </Flex>
  );
};

export default NoSearchData;
