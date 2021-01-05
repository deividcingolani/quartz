import { Flex } from 'rebass';
import React, { FC } from 'react';
import { Value } from '@logicalclocks/quartz';

// Types
import { TrainingDataset } from '../../../types/training-dataset';
// Components
import TrainingDatasetListContent from '../../project/training-dataset/list/TrainingDatasetListContent';
import NoSearchData from '../NoSearchData';

export interface TrainingDatasetsListProps {
  data: TrainingDataset[];
}

const TrainingDatasetsList: FC<TrainingDatasetsListProps> = ({ data }) => {
  if (!data.length) {
    return <NoSearchData subject="training datasets" />;
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
        <Value ml="5px">training datasets match</Value>
      </Flex>

      <TrainingDatasetListContent
        hasMatchText={true}
        data={data}
        isFiltered={false}
        onResetFilters={() => {}}
      />
    </Flex>
  );
};

export default TrainingDatasetsList;
