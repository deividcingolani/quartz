import { Flex } from 'rebass';
import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Components
import Loader from '../../../components/loader/Loader';
import TrainingDatasetsList from './TrainingDatasetsList';
// Types
import { SearchTypes } from '../types';
import { TrainingDataset } from '../../../types/training-dataset';
// Hooks
import useSearchData from '../hooks/useSearchData';
// Utils
import { getFeatureGroupsAndTrainingDatasetsMatches } from '../utils/getMatches';
import useQueryParams from '../hooks/useQueryParams';

const TrainingDatasetsDeepSearch: FC = () => {
  const queryParams = useQueryParams();
  const { id: projectId, searchText: initialSearch } = useParams();
  const [filteredData, setFilteredData] = useState<TrainingDataset[]>([]);

  const { data, isDataLoading, isKeywordsAndLastUpdateLoading } = useSearchData(
    +projectId,
    SearchTypes.td,
    initialSearch,
  );

  useEffect(() => {
    const filtered = getFeatureGroupsAndTrainingDatasetsMatches(
      data as TrainingDataset[],
      queryParams,
    ) as TrainingDataset[];
    setFilteredData(filtered);
  }, [queryParams, data]);

  return (
    <Flex
      width="100%"
      height="fit-content"
      minHeight="calc(100vh - 254px)"
      bg="grayShade3"
    >
      {isDataLoading ? (
        <Flex width="100%" height="max-content" minHeight="100%">
          <Loader />
        </Flex>
      ) : (
        <Flex overflow="auto" my="20px" width="100%" justifyContent="center">
          <TrainingDatasetsList
            data={filteredData}
            loading={isKeywordsAndLastUpdateLoading}
          />
        </Flex>
      )}
    </Flex>
  );
};

export default TrainingDatasetsDeepSearch;
