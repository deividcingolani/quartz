import { Box, Flex } from 'rebass';
import { useDispatch, useSelector } from 'react-redux';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button,
  Input,
  Tooltip,
  Select,
  Value,
  IconButton,
} from '@logicalclocks/quartz';
import routeNames from '../../../../routes/routeNames';
// Types
import { Dispatch } from '../../../../store';
import { FeatureGroup } from '../../../../types/feature-group';
// Utils
import useFeatureGroups from '../hooks/useFeatureGroups';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import { sortOptions, filterFG, sortFG, searchFGText } from '../utils';
// Selectors
import { selectFeatureStoreData } from '../../../../store/models/feature/selectors';
import NoData from '../../../../components/no-data/NoData';
import FeatureGroupListContent from './FeatureGroupListContent';
import Loader from '../../../../components/loader/Loader';
import useTitle from '../../../../hooks/useTitle';
import titles from '../../../../sources/titles';

const FeatureGroupList: FC = () => {
  const { id: projectId } = useParams();

  const [filter, setFilter] = useState<string[]>([]);
  const [sort, setSort] = useState<string[]>([Object.keys(sortOptions)[0]]);
  const [search, setSearch] = useState<string>('');
  const navigate = useNavigateRelative();

  const { data: featureStoreData } = useSelector(selectFeatureStoreData);

  const { data, isLoading } = useFeatureGroups(
    +projectId,
    featureStoreData?.featurestoreId,
  );

  const maxVersionsData = useMemo(
    () =>
      data.reduce((acc: FeatureGroup[], featureGroup) => {
        if (!acc.find(({ name }) => name === featureGroup.name)) {
          return [...acc, featureGroup];
        }
        const index = acc.findIndex(({ name }) => name === featureGroup.name);
        if (acc[index].version < featureGroup.version) {
          acc[index] = featureGroup;
          return acc;
        }
        return acc;
      }, []),
    [data],
  );

  const labels = useMemo(
    () =>
      maxVersionsData.reduce(
        (acc: string[], { labels }: FeatureGroup) => [
          // @ts-ignore
          ...new Set([...acc, ...labels]),
        ],
        [],
      ),
    [maxVersionsData],
  );

  const isFilterDisabled = isLoading || !labels?.length;

  const dispatch = useDispatch<Dispatch>();

  // Handlers
  const handleRefresh = useCallback(() => {
    if (featureStoreData?.featurestoreId) {
      dispatch.featureGroups.fetch({
        projectId: +projectId,
        featureStoreId: featureStoreData?.featurestoreId,
      });
    }
  }, [dispatch, projectId, featureStoreData]);

  const handleRouteChange = useCallback(
    (url: string) => () => {
      navigate(url, routeNames.project.view);
    },
    [navigate],
  );

  const handleResetFilters = useCallback(() => {
    setFilter([]);
    setSearch('');
  }, []);

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

    return sortFG(
      filterFG(searchFGText(maxVersionsData, search), filter),
      sortKey,
    );
  }, [maxVersionsData, sort, filter, search]);

  useTitle(titles.featureGroups);

  return (
    <Flex flexGrow={1} flexDirection="column">
      <Flex alignItems="center">
        <Input
          variant="white"
          disabled={!maxVersionsData.length}
          value={search}
          width="180px"
          placeholder="Find a feature group..."
          onChange={handleSearchChange}
        />
        <Tooltip
          ml="8px"
          disabled={!isFilterDisabled}
          mainText="No keywords defined"
        >
          <Select
            disabled={isFilterDisabled}
            maxWidth="180px"
            width="max-content"
            value={filter}
            variant="white"
            isMulti
            options={labels}
            noDataMessage="keywords"
            placeholder="keywords filter"
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
            listWidth="100%"
            ml="10px"
            options={Object.keys(sortOptions)}
            placeholder="sort by"
            onChange={setSort}
          />
        </Flex>
      </Flex>
      <Flex mt="20px" mb="20px">
        <Value primary px="5px">
          {dataResult.length}
        </Value>
        <Value>feature group displayed out of</Value>
        <Value primary px="5px">
          {maxVersionsData.length}
        </Value>
        <Value>features</Value>
        <Box ml="auto">
          <Button onClick={handleCreate}>New Feature Group</Button>
        </Box>
      </Flex>
      {isLoading && <Loader />}
      {!isLoading && (
        <FeatureGroupListContent
          data={dataResult}
          isFiltered={maxVersionsData.length !== dataResult.length}
          onResetFilters={handleResetFilters}
        />
      )}
      {!isLoading && !maxVersionsData.length && (
        <NoData
          mainText="No Feature Group"
          secondaryText="Create or import feature groups from sources"
        >
          <Button
            intent="secondary"
            onClick={handleRouteChange(routeNames.storageConnector.list)}
            mr="14px"
          >
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
