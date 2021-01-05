import { Flex } from 'rebass';
import React, { FC } from 'react';
import { useParams } from 'react-router-dom';

// Components
import LeftMenu from '../LeftMenu';
import Loader from '../../../components/loader/Loader';
import TrainingDatasetsList from './TrainingDatasetsList';
// Types
import { SearchTypes } from '../types';
import { TrainingDataset } from '../../../types/training-dataset';
// Hooks
import useSearchData from '../hooks/useSearchData';
// Utils
import { getFeatureGroupsAndTrainingDatasetsMatches } from '../utils/getMatches';

const TrainingDatasetsDeepSearch: FC = () => {
  const { id: projectId, searchText: initialSearch } = useParams();

  const { data, isLoading } = useSearchData(
    +projectId,
    SearchTypes.td,
    initialSearch,
  );

  if (isLoading) {
    return (
      <Flex width="100%" height="max-content" minHeight="100%">
        <LeftMenu isLoading={isLoading} />
        <Loader />
      </Flex>
    );
  }

  return (
    <Flex width="100%" height="max-content" minHeight="100%">
      <LeftMenu isLoading={isLoading} />

      <Flex overflow="auto" my="20px" width="100%">
        <TrainingDatasetsList
          data={
            getFeatureGroupsAndTrainingDatasetsMatches(
              data as TrainingDataset[],
            ) as TrainingDataset[]
          }
        />
      </Flex>
    </Flex>
  );
};

export default TrainingDatasetsDeepSearch;
