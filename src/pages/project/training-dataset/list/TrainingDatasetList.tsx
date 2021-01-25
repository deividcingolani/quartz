import React, { FC, useMemo, useState, ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Flex } from 'rebass';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Input,
  Tooltip,
  Select,
  Value,
  IconButton,
} from '@logicalclocks/quartz';
import { Dispatch } from '../../../../store';
import Loader from '../../../../components/loader/Loader';
import useTrainingDatasets from '../useTrainingDatasets';
import {
  sort as sortFn,
  filter as filterFn,
  searchText,
  pipe,
} from '../../../../utils';
import { selectFeatureStoreData } from '../../../../store/models/feature/selectors';
import { TrainingDataset } from '../../../../types/training-dataset';
import TrainingDatasetListContent from './TrainingDatasetListContent';
import NoData from '../../../../components/no-data/NoData';
import routeNames from '../../../../routes/routeNames';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import { selectFeatureGroups } from '../../../../store/models/localManagement/basket.selectors';
import useTitle from '../../../../hooks/useTitle';
import titles from '../../../../sources/titles';

export const sortOptions: { [key: string]: keyof TrainingDataset } = {
  'creation date': 'created',
  'last updated': 'created',
  name: 'name',
};

const TrainingDatasetList: FC = () => {
  useTitle(titles.trainingDatasets);

  const { id: projectId } = useParams();

  const dispatch = useDispatch<Dispatch>();

  const [filter, setFilter] = useState<string[]>([]);
  const [sort, setSort] = useState<string[]>([Object.keys(sortOptions)[2]]);
  const [search, setSearch] = useState<string>('');

  const { data: featureStoreData } = useSelector(selectFeatureStoreData);
  const { data, isLoading } = useTrainingDatasets(
    +projectId,
    featureStoreData?.featurestoreId,
  );

  const featureGroups = useSelector(selectFeatureGroups);

  const labels = useMemo(
    () =>
      data.reduce(
        (acc: string[], { labels: fgLabels = [] }: any) => [
          // @ts-ignore
          ...new Set([...acc, ...fgLabels]),
        ],
        [],
      ),
    [data],
  );

  const isFilterDisabled = isLoading || !labels?.length;

  function handleRefresh(): void {
    dispatch.trainingDatasets.set([]);
  }

  function handleCreate(): void {
    navigate('/new', '/p/:id/td/');
  }

  function handleResetFilters(): void {
    setFilter([]);
    setSearch('');
  }

  const navigate = useNavigateRelative();

  function handleSearchChange(ev: ChangeEvent<HTMLInputElement>): void {
    setSearch(ev.target.value);
  }

  function handleClickFG() {
    navigate(routeNames.featureGroup.list, 'p/:id/*');
  }

  const dataResult = useMemo(() => {
    const [sortKey] = sort;
    const key = sortOptions[sortKey];

    return pipe<TrainingDataset[]>(
      sortFn<TrainingDataset>(key as keyof TrainingDataset, sortFn.string),
      filterFn(filter, 'labels'),
      searchText(search),
    )(data);
  }, [data, sort, filter, search]);

  return (
    <Flex flexGrow={1} flexDirection="column">
      <Flex alignItems="center">
        <Input
          variant="white"
          label=""
          value={search}
          width="180px"
          placeholder="Find a training dataset..."
          onChange={handleSearchChange}
        />
        <Tooltip
          ml="8px"
          disabled={!isFilterDisabled}
          mainText="No keywords defined. Add them from edit page of feature groups"
        >
          <Select
            disabled={isFilterDisabled}
            maxWidth="180px"
            width="max-content"
            value={filter}
            variant="white"
            isMulti
            noDataMessage="keywords"
            options={labels}
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
        <Value primary mr="5px">
          {dataResult.length}
        </Value>
        <Value>training datasets</Value>
        <Box ml="auto">
          <Button disabled={!featureGroups.length} onClick={handleCreate}>
            New Training Dataset
          </Button>
        </Box>
      </Flex>
      {isLoading && <Loader />}
      {!isLoading && (
        <TrainingDatasetListContent
          data={dataResult}
          isFiltered={data.length !== dataResult.length}
          onResetFilters={handleResetFilters}
        />
      )}
      {!isLoading && !data.length && (
        <NoData
          mainText="No Training Dataset"
          secondaryText="Create one from feature groups"
        >
          <Button intent="secondary" onClick={handleClickFG}>
            Feature Groups
          </Button>
          <Button
            disabled={!featureGroups.length}
            intent="primary"
            ml="20px"
            onClick={handleCreate}
          >
            New Training Dataset
          </Button>
        </NoData>
      )}
    </Flex>
  );
};

export default TrainingDatasetList;
