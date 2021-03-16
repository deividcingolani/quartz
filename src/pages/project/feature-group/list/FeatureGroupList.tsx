import { Box, Flex } from 'rebass';
import { useDispatch, useSelector } from 'react-redux';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Input, Tooltip, Select, Value } from '@logicalclocks/quartz';
import routeNames from '../../../../routes/routeNames';
// Types
import { Dispatch, RootState } from '../../../../store';
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
import useGetHrefForRoute from '../../../../hooks/useGetHrefForRoute';
import icons from '../../../../sources/icons';

const FeatureGroupList: FC = () => {
  const { id: projectId } = useParams();

  const [filter, setFilter] = useState<string[]>([]);
  const [sort, setSort] = useState<string[]>([Object.keys(sortOptions)[1]]);
  const [search, setSearch] = useState<string>('');
  const navigate = useNavigateRelative();

  const { data: featureStoreData } = useSelector(selectFeatureStoreData);

  const { data, isLoading } = useFeatureGroups(
    +projectId,
    featureStoreData?.featurestoreId,
  );

  const isKeywordsAndLastUpdateLoading = useSelector(
    (state: RootState) =>
      state.loading.effects.featureGroups.fetchKeywordsAndLastUpdate,
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

  const isFilterDisabled =
    isLoading || !labels?.length || isKeywordsAndLastUpdateLoading;

  const dispatch = useDispatch<Dispatch>();

  const getHref = useGetHrefForRoute();

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
    <Flex mb="20px" flexGrow={1} flexDirection="column">
      <Flex alignItems="center">
        <Input
          variant="white"
          disabled={!maxVersionsData.length}
          value={search}
          width="180px"
          placeholder="Find a feature group..."
          onChange={handleSearchChange}
        />
        {!!labels.length && (
          <Tooltip
            ml="8px"
            mt="7px"
            disabled={!isFilterDisabled}
            mainText="No keywords defined"
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
              options={labels}
              noDataMessage="keywords"
              placeholder="keywords"
              onChange={setFilter}
            />
          </Tooltip>
        )}
        <Flex ml="auto" alignItems="center">
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
          <Select
            width="150px"
            variant="white"
            value={sort}
            listWidth="100%"
            ml="10px"
            disabled={isKeywordsAndLastUpdateLoading || isLoading}
            options={Object.keys(sortOptions)}
            placeholder="sort by"
            onChange={setSort}
          />
        </Flex>
      </Flex>
      <Flex mt="20px" mb="20px">
        {!isLoading && (
          <>
            <Value primary px="5px">
              {dataResult.length}
            </Value>
            <Value>out of</Value>
            <Value primary px="5px">
              {maxVersionsData.length}
            </Value>
            <Value>feature groups displayed</Value>
          </>
        )}
        <Box ml="auto">
          <Button
            href={getHref(
              routeNames.featureGroup.create,
              routeNames.project.view,
            )}
            onClick={handleCreate}
          >
            New Feature Group
          </Button>
        </Box>
      </Flex>
      {isLoading && <Loader />}
      {!isLoading && (
        <FeatureGroupListContent
          data={dataResult}
          loading={isKeywordsAndLastUpdateLoading}
          isFiltered={maxVersionsData.length !== dataResult.length}
          onResetFilters={handleResetFilters}
        />
      )}
      {!isLoading && !maxVersionsData.length && (
        <NoData
          mainText="No Feature Groups"
          secondaryText="You can create a feature group from the UI or in a program"
        >
          <Button
            intent="secondary"
            onClick={handleRouteChange(routeNames.storageConnector.list)}
            href={getHref(
              routeNames.storageConnector.list,
              routeNames.project.view,
            )}
            mr="14px"
          >
            All Storage Connectors
          </Button>
          <Button
            href={getHref('', routeNames.project.view)}
            intent="secondary"
            onClick={handleRouteChange('')}
            mr="14px"
          >
            Feature Group Documentation
          </Button>
          <Button
            href={getHref(
              routeNames.featureGroup.create,
              routeNames.project.view,
            )}
            onClick={handleCreate}
          >
            New Feature Group
          </Button>
        </NoData>
      )}
    </Flex>
  );
};

export default FeatureGroupList;
