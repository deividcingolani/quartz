import React, { FC, useMemo, useState, ChangeEvent } from 'react';
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
import Card from './Card';
import Loader from '../../../../components/loader/Loader';
import useTrainingDatasets from '../useTrainingDatasets';
import { NoResults } from './NoResults';
import {
  sortFn,
  filterFn,
  searchTextFn,
} from '../../../../utils/filter-sort.util';
import { selectFeatureStoreData } from '../../../../store/models/feature/selectors';
import { pipe } from '../../../../utils';
import { NoFilterResults } from './NoFilterResults';
import { ITrainingDataset } from '../../../../types/training-dataset';

export interface ITrainingDatasetListProps {
  projectId: number;
}

interface SortParams {
  [key: string]: (fg1: any, fg2: any) => number;
}

export const sortOptions: SortParams = {
  'creation date': ({ created: c1 }, { created: c2 }) => {
    const time1 = new Date(c1).getTime();
    const time2 = new Date(c2).getTime();

    if (time1 === time2) {
      return 0;
    }

    return time1 < time2 ? 1 : -1;
  },
  'last updated': ({ updated: c1 }, { updated: c2 }) => {
    const time1 = new Date(c1).getTime();
    const time2 = new Date(c2).getTime();

    if (time1 === time2) {
      return 0;
    }

    return time1 < time2 ? 1 : -1;
  },
  name: ({ name: n1 }, { name: n2 }) => n1.localeCompare(n2),
};

const TrainingDatasetList: FC<ITrainingDatasetListProps> = (
  props: ITrainingDatasetListProps,
) => {
  const { projectId } = props;
  const dispatch = useDispatch<Dispatch>();
  const [filter, setFilter] = useState<string[]>([]);
  const [sort, setSort] = useState<string[]>([]);
  const [search, setSearch] = useState<string>('');
  const isLabelsLoading = useSelector(
    ({ loading }: RootState) => loading.models.trainingDatasetLabels,
  );
  const { data: featureStoreData } = useSelector(selectFeatureStoreData);
  const { data, isLoading } = useTrainingDatasets(
    projectId,
    featureStoreData?.featurestoreId,
  );
  const labels = useMemo(
    () =>
      data.reduce(
        (acc: string[], { labels: fgLabels = [] }: any) => [
          ...acc,
          ...fgLabels,
        ],
        [],
      ),
    [data],
  );

  const isFilterDisabled = isLoading || isLabelsLoading || !labels?.length;

  function handleRefresh(): void {
    dispatch.trainingDatasets.clear();
  }

  function handleCreate(): void {
    console.log('New Training Dataset');
  }

  function handleResetFilters(): void {
    setFilter([]);
    setSort([]);
    setSearch('');
  }

  function handleSearchChange(ev: ChangeEvent<HTMLInputElement>): void {
    setSearch(ev.target.value);
  }

  const dataResult = useMemo(() => {
    const [sortKey] = sort;

    return pipe<ITrainingDataset[]>(
      sortFn(sortOptions, sortKey),
      filterFn(filter, 'labels'),
      searchTextFn(search),
    )(data);
  }, [data, sort, filter, search]);

  return isLoading ? (
    <Loader />
  ) : data.length ? (
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
          {dataResult.length}
        </Value>
        <Value>training sets</Value>
        <Box ml="auto">
          <Button onClick={handleCreate}>New Training Dataset</Button>
        </Box>
      </Flex>

      {dataResult.length ? (
        <>
          {dataResult.map((item) => (
            <Card key={item.id} data={item} isLabelsLoading={isLabelsLoading} />
          ))}
        </>
      ) : (
        <NoFilterResults handleResetFilters={handleResetFilters} />
      )}
    </Flex>
  ) : (
    <NoResults handleCreate={handleCreate} />
  );
};

export default TrainingDatasetList;
