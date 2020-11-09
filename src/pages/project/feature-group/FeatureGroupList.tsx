import { Box, Flex } from 'rebass';
import { useDispatch, useSelector } from 'react-redux';
import React, { FC, useCallback, useMemo, useState } from 'react';
import {
  Button,
  Input,
  Tooltip,
  Select,
  Value,
  IconButton,
} from '@logicalclocks/quartz';

import routeNames from '../../../routes/routeNames';
// Types
import { Dispatch } from '../../../store';
import { FeatureGroup } from '../../../types/feature-group';
// Utils
import useFeatureGroups from './hooks/useFeatureGroups';
import useNavigateRelative from '../../../hooks/useNavigateRelative';
import { sortOptions, filterFG, sortFG, searchFGText } from './utils';
// Selectors
import {
  selectFeatureStoreData,
  selectLabelsLoading,
} from '../../../store/models/feature/selectors';
import NoData from '../../../components/no-data/NoData';
import FeatureGroupListContent from './FeatureGroupListContent';
import Loader from '../../../components/loader/Loader';

export interface FeatureGroupProps {
  projectId: number;
}

const FeatureGroupList: FC<FeatureGroupProps> = ({
  projectId,
}: FeatureGroupProps) => {
  const [filter, setFilter] = useState<string[]>([]);
  const [sort, setSort] = useState<string[]>([]);
  const [search, setSearch] = useState<string>('');
  const navigate = useNavigateRelative();

  const isLabelsLoading = useSelector(selectLabelsLoading);

  const { data: featureStoreData } = useSelector(selectFeatureStoreData);

  const { data, isLoading } = useFeatureGroups(
    projectId,
    featureStoreData?.featurestoreId,
  );

  const labels = useMemo(
    () =>
      data.reduce(
        (acc: string[], { labels: fgLabels = [] }: FeatureGroup) => [
          ...acc,
          ...fgLabels,
        ],
        [],
      ),
    [data],
  );

  const isFilterDisabled = isLoading || isLabelsLoading || !labels?.length;

  const dispatch = useDispatch<Dispatch>();

  // Handlers
  const handleRefresh = useCallback(() => {
    if (featureStoreData?.featurestoreId) {
      dispatch.featureGroups.fetch({
        projectId,
        featureStoreId: featureStoreData?.featurestoreId,
      });
    }
  }, [dispatch, projectId, featureStoreData]);

  const handleResetFilters = useCallback(() => {
    setFilter([]);
    setSearch('');
  }, []);

  const handleRouteChange = useCallback(
    (url: string) => () => {
      console.log('Navigate to', url);
    },
    [],
  );

  const handleCreate = useCallback(() => {
    navigate(routeNames.featureGroup.create, routeNames.project.view);
  }, [navigate]);

  const handleSearchChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>): void => {
    setSearch(target.value);
  };

  const dataResult = useMemo(() => {
    const [sortKey] = sort;

    return sortFG(filterFG(searchFGText(data, search), filter), sortKey);
  }, [data, sort, filter, search]);

  return (
    <Flex flexGrow={1} flexDirection="column">
      <Flex alignItems="center">
        <Input
          variant="white"
          disabled={!data.length}
          value={search}
          width="180px"
          placeholder="Find a feature group..."
          onChange={handleSearchChange}
        />
        <Tooltip
          ml="8px"
          disabled={!isFilterDisabled}
          mainText="No label defined. Add them from edit page of feature groups"
        >
          <Select
            disabled={isFilterDisabled}
            maxWidth="180px"
            width="max-content"
            value={filter}
            variant="white"
            isMulti
            options={labels}
            placeholder="label filter"
            onChange={setFilter}
          />
        </Tooltip>
        <Flex ml="auto" alignItems="center">
          <IconButton
            tooltip="Refresh"
            icon="sync-alt"
            onClick={handleRefresh}
          />
          <Select
            width="150px"
            variant="white"
            value={sort}
            ml="10px"
            options={Object.keys(sortOptions)}
            placeholder="sort by"
            onChange={setSort}
          />
        </Flex>
      </Flex>
      <Flex mt="20px" mb="20px">
        <Value primary mr="5px">
          {data.length}
        </Value>
        <Value>feature groups</Value>
        <Box ml="auto">
          <Button onClick={handleCreate}>New Feature Group</Button>
        </Box>
      </Flex>
      {isLoading && <Loader />}
      {!isLoading && (
        <FeatureGroupListContent
          data={dataResult}
          isFiltered={data.length !== dataResult.length}
          onResetFilters={handleResetFilters}
          isLabelsLoading={isLabelsLoading}
        />
      )}
      {!isLoading && !data.length && (
        <NoData
          mainText="No Feature Group"
          secondaryText="Create or import feature groups from sources"
        >
          <Button intent="secondary" onClick={handleRouteChange('')} mr="14px">
            All Sources
          </Button>
          <Button intent="secondary" onClick={handleRouteChange('')} mr="14px">
            Feature Group Documentation
          </Button>
          <Button onClick={handleCreate}>New Feature Group</Button>
        </NoData>
      )}
    </Flex>
  );
};

export default FeatureGroupList;
