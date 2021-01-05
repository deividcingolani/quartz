import { Flex } from 'rebass';
import React, { FC } from 'react';
import { useParams } from 'react-router-dom';

// Components
import LeftMenu from '../LeftMenu';
import FeaturesList from './FeaturesList';
// Types
import { SearchTypes } from '../types';
import { Feature } from '../../../types/feature-group';
// Hooks
import useSearchData from '../hooks/useSearchData';
import Loader from '../../../components/loader/Loader';
// Utils
import { getFeaturesMatches } from '../utils/getMatches';

const FeaturesDeepsSearch: FC = () => {
  const { id: projectId, searchText: initialSearch } = useParams();

  const { data, isLoading } = useSearchData(
    +projectId,
    SearchTypes.feature,
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

      <Flex overflow="auto" mt="20px" width="100%">
        <FeaturesList data={getFeaturesMatches(data as Feature[])} />
      </Flex>
    </Flex>
  );
};

export default FeaturesDeepsSearch;
