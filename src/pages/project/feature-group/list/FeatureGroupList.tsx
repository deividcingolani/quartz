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

// Types
import { Dispatch, RootState } from '../../../../store';
import { FeatureGroup } from '../../../../types/feature-group';
// Components
import Card from './Card';
import Loader from '../../../../components/loader/Loader';
// Utils
import useFeatureGroups from '../useFeatureGroups';
import { sortOptions, filterFG, sortFG, searchFGText } from '../utils';
// Selectors
import { selectFeatureStoreData } from '../../../../store/models/feature/selectors';

export interface FeatureGroupProps {
  projectId: number;
}

const FeatureGroupList: FC<FeatureGroupProps> = ({
  projectId,
}: FeatureGroupProps) => {
  const [filter, setFilter] = useState<string[]>([]);
  const [sort, setSort] = useState<string[]>([]);
  const [search, setSearch] = useState<string>('');

  const isLabelsLoading = useSelector(
    ({ loading }: RootState) => loading.models.featureGroupLabels,
  );

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
    dispatch.featureGroups.setFeatureGroups([]);
  }, [dispatch]);

  const handleCreate = useCallback(() => {
    console.log('New Feature Group');
  }, []);

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
          label=""
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
      {isLoading ? (
        <Loader />
      ) : (
        dataResult.map((item) => (
          <Card key={item.id} data={item} isLabelsLoading={isLabelsLoading} />
        ))
      )}
    </Flex>
  );
};

export default FeatureGroupList;
