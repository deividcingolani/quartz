// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useMemo, useState, ChangeEvent } from 'react';
import { Box, Flex } from 'rebass';
// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Input,
  Tooltip,
  Select,
  Value,
  Divider,
} from '@logicalclocks/quartz';

// Types
import { Dispatch, RootState } from '../../../../store';
import { TrainingDataset } from '../../../../types/training-dataset';
// Components
import Loader from '../../../../components/loader/Loader';
import NoData from '../../../../components/no-data/NoData';
// Hooks
import useTitle from '../../../../hooks/useTitle';

import TrainingDatasetListContent from './TrainingDatasetListContent';
import useGetHrefForRoute from '../../../../hooks/useGetHrefForRoute';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import useUserPermissions from '../../feature-group/overview/useUserPermissions';
// Utils
import { SortDirection } from '../../../../utils/sort';
import {
  sort as sortFn,
  filter as filterFn,
  searchText,
  pipe,
} from '../../../../utils';

import icons from '../../../../sources/icons';
import titles from '../../../../sources/titles';
import routeNames from '../../../../routes/routeNames';
import TdInfoService from '../../../../services/localStorage/TdInfoService';

export const sortOptions: { [key: string]: keyof TrainingDataset } = {
  'last updated': 'updated',
  'last created': 'created',
  name: 'name',
};

export interface TrainingDatasetListProps {
  selectFSValue: string[];
  isLoading: boolean;
  data: TrainingDataset[];
  hasSharedFS: boolean;
  selectFSOptions: string[];
  handleFSSelectionChange: ([value]: any) => void;
}

const TrainingDatasetList: FC<TrainingDatasetListProps> = ({
  selectFSValue,
  isLoading,
  data,
  hasSharedFS,
  selectFSOptions,
  handleFSSelectionChange,
}) => {
  useTitle(titles.trainingDatasets);

  const dispatch = useDispatch<Dispatch>();

  const { id: projectId, fsId } = useParams();
  const { id: userId } = useSelector((state: RootState) => state.profile);

  const getHref = useGetHrefForRoute();

  const [filter, setFilter] = useState<string[]>([]);
  const [sort, setSort] = useState<string[]>([Object.keys(sortOptions)[1]]);
  const [search, setSearch] = useState<string>('');

  const { canEdit, isLoading: isPermissionsLoading } = useUserPermissions();

  const isKeywordsAndLastUpdateLoading = useSelector(
    (state: RootState) =>
      state.loading.effects.trainingDatasets.fetchKeywordsAndLastUpdate,
  );

  const maxVersionsData = useMemo(
    () =>
      (data as TrainingDataset[]).reduce(
        (acc: TrainingDataset[], trainingDateset) => {
          if (!acc.find(({ name }) => name === trainingDateset.name)) {
            return [...acc, trainingDateset];
          }
          const index = acc.findIndex(
            ({ name }) => name === trainingDateset.name,
          );
          if (acc[index].version < trainingDateset.version) {
            acc[index] = trainingDateset;
            return acc;
          }
          return acc;
        },
        [],
      ),
    [data],
  );

  const labels = useMemo(
    () =>
      maxVersionsData.reduce(
        (acc: string[], { labels: fgLabels = [] }: any) => [
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          ...new Set([...acc, ...fgLabels]),
        ],
        [],
      ),
    [maxVersionsData],
  );

  const isFilterDisabled =
    isLoading || !labels?.length || isKeywordsAndLastUpdateLoading;

  function handleRefresh(): void {
    dispatch.trainingDatasets.fetch({
      projectId: +projectId,
      featureStoreId: +fsId,
    });
  }

  const navigate = useNavigateRelative();

  function handleCreate(): void {
    TdInfoService.delete({
      userId,
      projectId: +projectId,
    });
    dispatch.basket.switch({
      active: true,
      projectId: +projectId,
      userId,
    });
    navigate('/new', '/p/:id/fs/:fsId/td/');
  }

  function handleGoBack(): void {
    dispatch.basket.switch({ userId, projectId: +projectId, active: true });
    navigate('/new', '/p/:id/fs/:fsId/td/');
  }

  function handleResetFilters(): void {
    setFilter([]);
    setSearch('');
  }

  function handleSearchChange(ev: ChangeEvent<HTMLInputElement>): void {
    setSearch(ev.target.value);
  }

  function handleClickFG() {
    navigate(
      routeNames.featureGroup.list.replace(':fsId', fsId),
      routeNames.project.view,
    );
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
    )(maxVersionsData);
  }, [maxVersionsData, sort, filter, search]);

  const hasActiveTD = TdInfoService.getInfo({ userId, projectId: +projectId });

  return (
    <Flex mb="40px" flexDirection="column">
      <Flex alignItems="center">
        <Input
          labelProps={{ flexGrow: 1, mr: '8px' }}
          variant="white"
          label=""
          value={search}
          disabled={!maxVersionsData.length}
          placeholder="Find a training dataset..."
          onChange={handleSearchChange}
        />
        {!!labels.length && (
          <Tooltip
            mr="8px"
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
        {hasSharedFS && (
          <Select
            mr="8px"
            width="auto"
            variant="white"
            listWidth="max-content"
            placeholder="feature store"
            value={selectFSValue}
            options={selectFSOptions}
            onChange={handleFSSelectionChange}
          />
        )}
        <Box ml="32px">
          <Tooltip
            mainText="You have no edit right on the feature store"
            disabled={canEdit && !isPermissionsLoading}
          >
            <Button
              onClick={handleCreate}
              disabled={!canEdit || isPermissionsLoading}
              href={getHref('/new', '/p/:id/fs/:fsId/td/')}
              intent={hasActiveTD ? 'secondary' : 'primary'}
            >
              New Training Dataset
            </Button>
          </Tooltip>
        </Box>
        {hasActiveTD && (
          <Box ml="10px">
            <Tooltip
              mainText="You have no edit right on the feature store"
              disabled={canEdit && !isPermissionsLoading}
            >
              <Button
                onClick={handleGoBack}
                disabled={!canEdit || isPermissionsLoading}
                href={getHref('/new', '/p/:id/fs/:fsId/td/')}
              >
                Back to Training Dataset
              </Button>
            </Tooltip>
          </Box>
        )}
      </Flex>
      <Divider
        mt="10px"
        mb="10px"
        ml="0px"
        width="100%"
        sx={{ backgroundColor: 'grayShade2', height: '3px' }}
      />
      <Flex mb="20px" justifyContent="space-between" alignItems="center">
        <Flex>
          {!isLoading && (
            <>
              <Value primary mr="5px">
                {dataResult.length}
              </Value>
              <Value>training datasets</Value>
            </>
          )}
        </Flex>

        <Flex ml="auto" alignItems="center">
          <Select
            width="150px"
            variant="white"
            value={sort}
            listWidth="100%"
            disabled={isKeywordsAndLastUpdateLoading || isLoading}
            mr="10px"
            options={Object.keys(sortOptions)}
            placeholder="sort by"
            onChange={setSort}
          />
          <Tooltip mainText="Refresh">
            <Flex
              onClick={handleRefresh}
              backgroundColor="#FFFFFF"
              justifyContent="center"
              alignItems="center"
              width="34px"
              height="32px"
              sx={{
                borderStyle: 'solid',
                borderWidth: '1px',
                borderColor: 'grayShade1',
                cursor: 'pointer',
                transition: 'all .25s ease',

                ':hover': {
                  borderColor: 'black',
                },
              }}
            >
              {icons.refresh}
            </Flex>
          </Tooltip>
        </Flex>
      </Flex>
      {isLoading && <Loader />}
      {!isLoading && (
        <TrainingDatasetListContent
          data={dataResult}
          isFiltered={maxVersionsData.length !== dataResult.length}
          loading={isKeywordsAndLastUpdateLoading}
          onResetFilters={handleResetFilters}
        />
      )}
      {!isLoading && !maxVersionsData.length && (
        <NoData
          mainText={
            hasSharedFS
              ? 'No Training Datasets for the selected feature store'
              : 'No Training Datasets'
          }
          secondaryText={
            hasSharedFS
              ? 'Create one from feature groups or select another feature store'
              : 'Create one from feature groups'
          }
        >
          <Button
            href={getHref(routeNames.featureGroup.list, 'p/:id/fs/:fsId/*')}
            intent="secondary"
            onClick={handleClickFG}
          >
            Feature Groups
          </Button>
          <Button
            href={getHref('/new', '/p/:id/fs/:fsId/td/')}
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
