import { Flex } from 'rebass';
import React, { FC } from 'react';
import { Value } from '@logicalclocks/quartz';

// Components
import FeatureGroupListContent from '../../project/feature-group/list/FeatureGroupListContent';
// Types
import { FeatureGroup } from '../../../types/feature-group';
import NoSearchData from '../NoSearchData';

export interface FeatureGroupsListProps {
  data: FeatureGroup[];
}

const FeatureGroupsList: FC<FeatureGroupsListProps> = ({ data }) => {
  if (!data.length) {
    return <NoSearchData subject="feature groups" />;
  }

  return (
    <Flex
      height="calc(100vh - 195px)"
      width="100%"
      margin="0 auto"
      maxWidth="1200px"
      flexDirection="column"
    >
      <Flex mb="20px">
        <Value primary>{data.length}</Value>
        <Value ml="5px">features groups match</Value>
      </Flex>
      <Flex width="100%" margin="0 auto" flexDirection="column">
        <FeatureGroupListContent
          hasMatchText={true}
          data={data}
          isFiltered={false}
          onResetFilters={() => {}}
        />
      </Flex>
    </Flex>
  );
};

export default FeatureGroupsList;
