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
  loading?: boolean;
}

const FeatureGroupsList: FC<FeatureGroupsListProps> = ({ data, loading }) => {
  if (!data.length) {
    return <NoSearchData subject="feature groups" />;
  }

  return (
    <Flex
      margin="0 auto"
      width="100%"
      mx="150px"
      maxWidth="1200px"
      flexDirection="column"
    >
      <Flex width="100%" margin="0 auto" flexDirection="column">
        <FeatureGroupListContent
          hasMatchText={true}
          data={data}
          loading={loading}
          isFiltered={false}
          onResetFilters={() => {}}
        />
      </Flex>
    </Flex>
  );
};

export default FeatureGroupsList;
