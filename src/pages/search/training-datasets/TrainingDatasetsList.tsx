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
  loading?: boolean;
}

const TrainingDatasetsList: FC<TrainingDatasetsListProps> = ({
  data,
  loading,
}) => {
  if (!data.length) {
    return <NoSearchData subject="training datasets" />;
  }

  return (
    <Flex
      margin="0 auto"
      mx="150px"
      width="100%"
      maxWidth="1200px"
      flexDirection="column"
    >
      <TrainingDatasetListContent
        hasMatchText={true}
        data={data}
        isFiltered={false}
        loading={loading}
        onResetFilters={() => {}}
      />
    </Flex>
  );
};

export default TrainingDatasetsList;
