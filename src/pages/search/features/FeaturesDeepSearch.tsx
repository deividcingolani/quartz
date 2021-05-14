import { Flex } from 'rebass';
import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Components
import FeaturesList from './FeaturesList';
// Types
import { SearchTypes } from '../types';
import { Feature } from '../../../types/feature-group';
// Hooks
import useSearchData from '../hooks/useSearchData';
import Loader from '../../../components/loader/Loader';
// Utils
import { getFeaturesMatches } from '../utils/getMatches';
import useQueryParams from '../hooks/useQueryParams';

const FeaturesDeepsSearch: FC = () => {
  const queryParams = useQueryParams();
  const { id: projectId, searchText: initialSearch } = useParams();
  const [filteredData, setFilteredData] = useState<Feature[]>([]);

  const { data, isDataLoading } = useSearchData(
    +projectId,
    SearchTypes.feature,
    initialSearch,
  );

  useEffect(() => {
    const filtered = getFeaturesMatches(data as Feature[], queryParams);
    setFilteredData(filtered);
  }, [queryParams, data]);

  return (
    <Flex
      width="100%"
      height="fit-content"
      bg="grayShade3"
      minHeight="calc(100vh - 254px)"
    >
      {isDataLoading ? (
        <Flex width="100%" height="max-content" minHeight="100%">
          <Loader />
        </Flex>
      ) : (
        <Flex overflow="auto" my="20px" width="100%" justifyContent="center">
          <FeaturesList data={filteredData} />
        </Flex>
      )}
    </Flex>
  );
};

export default FeaturesDeepsSearch;
