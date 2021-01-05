import { Flex } from 'rebass';
import React, { FC } from 'react';
import { useParams } from 'react-router-dom';

// Components
import LeftMenu from '../LeftMenu';
import FeatureGroupsList from './FeatureGroupsList';
import Loader from '../../../components/loader/Loader';
// Types
import { SearchTypes } from '../types';
import { FeatureGroup } from '../../../types/feature-group';
// Hooks
import useSearchData from '../hooks/useSearchData';
// Utils
import { getFeatureGroupsAndTrainingDatasetsMatches } from '../utils/getMatches';

const FeatureGroupsDeepsSearch: FC = () => {
  const { id: projectId, searchText: initialSearch } = useParams();

  const { data, isLoading } = useSearchData(
    +projectId,
    SearchTypes.fg,
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
        <FeatureGroupsList
          data={
            getFeatureGroupsAndTrainingDatasetsMatches(
              data as FeatureGroup[],
            ) as FeatureGroup[]
          }
        />
      </Flex>
    </Flex>
  );
};

export default FeatureGroupsDeepsSearch;
