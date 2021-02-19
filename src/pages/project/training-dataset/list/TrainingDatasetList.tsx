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
import { Dispatch, RootState } from '../../../../store';
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
import { SortDirection } from '../../../../utils/sort';
import useTitle from '../../../../hooks/useTitle';
import titles from '../../../../sources/titles';
import useGetHrefForRoute from '../../../../hooks/useGetHrefForRoute';

export const sortOptions: { [key: string]: keyof TrainingDataset } = {
  'last updated': 'updated',
  'last created': 'created',
  name: 'name',
};

const TrainingDatasetList: FC = () => {
  useTitle(titles.trainingDatasets);

  const { id: projectId } = useParams();

  const dispatch = useDispatch<Dispatch>();

  const getHref = useGetHrefForRoute();

  const [filter, setFilter] = useState<string[]>([]);
  const [sort, setSort] = useState<string[]>([Object.keys(sortOptions)[1]]);
  const [search, setSearch] = useState<string>('');

  const { data: featureStoreData } = useSelector(selectFeatureStoreData);
  const { data, isLoading } = useTrainingDatasets(
    +projectId,
    featureStoreData?.featurestoreId,
  );

  const isKeywordsAndLastUpdateLoading = useSelector(
    (state: RootState) =>
      state.loading.effects.trainingDatasets.fetchKeywordsAndLastUpdate,
  );

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

  const isFilterDisabled =
    isLoading || !labels?.length || isKeywordsAndLastUpdateLoading;

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
      sortFn<TrainingDataset>(
        key as keyof TrainingDataset,
        sortFn.string,
        SortDirection.desc,
      ),
      filterFn(filter, 'labels'),
      searchText(search),
    )(data);
  }, [data, sort, filter, search]);

  return (
    <Flex mb="40px" flexGrow={1} flexDirection="column">
      <Flex alignItems="center">
        <Input
          variant="white"
          label=""
          value={search}
          width="180px"
          disabled={!data.length}
          placeholder="Find a training dataset..."
          onChange={handleSearchChange}
        />
        {!!labels.length && (
          <Tooltip
            ml="8px"
            mt="7px"
            disabled={!isFilterDisabled}
            mainText="No keywords defined."
          >
            <Select
              disabled={isFilterDisabled}
              maxWidth="180px"
              width="max-content"
              value={
                filter.length
                  ? filter.filter((keyword) => keyword !== 'any')
                  : ['any']
              }
              variant="white"
              isMulti
              mt="-7px"
              noDataMessage="keywords"
              options={labels}
              placeholder="keywords"
              onChange={setFilter}
            />
          </Tooltip>
        )}
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
            disabled={isKeywordsAndLastUpdateLoading || isLoading}
            ml="10px"
            options={Object.keys(sortOptions)}
            placeholder="sort by"
            onChange={setSort}
          />
        </Flex>
      </Flex>
      <Flex mt="20px" mb="20px">
        {!isLoading && (
          <>
            <Value primary mr="5px">
              {dataResult.length}
            </Value>
            <Value>training datasets</Value>
          </>
        )}
        <Box ml="auto">
          <Button onClick={handleCreate} href={getHref('/new', '/p/:id/td/')}>
            New Training Dataset
          </Button>
        </Box>
      </Flex>
      {isLoading && <Loader />}
      {!isLoading && (
        <TrainingDatasetListContent
          data={dataResult}
          loading={isKeywordsAndLastUpdateLoading}
          isFiltered={data.length !== dataResult.length}
          onResetFilters={handleResetFilters}
        />
      )}
      {!isLoading && !data.length && (
        <NoData
          mainText="No Training Dataset"
          secondaryText="Create one from feature groups"
        >
          <Button
            href={getHref(routeNames.featureGroup.list, 'p/:id/*')}
            intent="secondary"
            onClick={handleClickFG}
          >
            Feature Groups
          </Button>
          <Button
            href={getHref('/new', '/p/:id/td/')}
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
