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
  usePopup,
  Divider,
} from '@logicalclocks/quartz';
import routeNames from '../../../../routes/routeNames';
import BasketTutoPopup from '../../../../components/basket/BasketTutoPopup';
// Types
import { Dispatch, RootState } from '../../../../store';
import { FeatureGroup } from '../../../../types/feature-group';
import { SharedDataset } from '../../../../store/models/projects/multistore.model';
// Utils
import { sortOptions, filterFG, sortFG, searchFGText } from '../utils';
import { isSelectionActive } from '../../../../components/basket/utils';
// Selectors
import NoData from '../../../../components/no-data/NoData';
import FeatureGroupListContent from './FeatureGroupListContent';
import Loader from '../../../../components/loader/Loader';
import titles from '../../../../sources/titles';
import icons from '../../../../sources/icons';
// Hooks
import useFeatureGroups, {
  UseFeatureGroupsData,
} from '../hooks/useFeatureGroups';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import useTitle from '../../../../hooks/useTitle';
import useGetHrefForRoute from '../../../../hooks/useGetHrefForRoute';
import useMultiStoreSelect from '../../../../hooks/useMultiStoreSelect';
import useUserPermissions from '../overview/useUserPermissions';

export interface FeatureGroupListProps {
  sharedFrom: SharedDataset[];
}

const FeatureGroupList: FC<FeatureGroupListProps> = ({ sharedFrom }) => {
  const { id: projectId, fsId } = useParams();
  const [filter, setFilter] = useState<string[]>([]);
  const [sort, setSort] = useState<string[]>([Object.keys(sortOptions)[1]]);
  const [search, setSearch] = useState<string>('');
  const navigate = useNavigateRelative();

  const { canEdit, isLoading: isPermissionsLoading } = useUserPermissions();

  const {
    selectFSValue,
    selectFSOptions,
    handleFSSelectionChange,
    data,
    isLoading,
    hasSharedFS,
  } = useMultiStoreSelect<UseFeatureGroupsData>(useFeatureGroups, sharedFrom);

  const isKeywordsAndLastUpdateLoading = useSelector(
    (state: RootState) =>
      state.loading.effects.featureGroups.fetchKeywordsAndLastUpdate,
  );

  const maxVersionsData = useMemo(
    () =>
      (data as FeatureGroup[]).reduce((acc: FeatureGroup[], featureGroup) => {
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
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
    dispatch.featureGroups.fetch({
      projectId: +projectId,
      featureStoreId: +fsId,
    });
  }, [dispatch.featureGroups, projectId, fsId]);

  const handleRouteChange = useCallback(
    (url: string) => () => {
      navigate(url.replace(':fsId', fsId), routeNames.project.view);
    },
    [navigate, fsId],
  );

  const handleResetFilters = useCallback(() => {
    setFilter([]);
    setSearch('');
  }, []);

  const handleCreate = useCallback(() => {
    navigate(
      routeNames.featureGroup.create.replace(':fsId', fsId),
      routeNames.project.view,
    );
  }, [navigate, fsId]);

  const buildHref = useCallback(
    (to: string, relativeTo: string) =>
      getHref(to.replace(':fsId', fsId), relativeTo),
    [getHref, fsId],
  );

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

  // Features picking tutorial
  const shouldShowTutorial = useSelector(
    (state: RootState) => state.basket.showTutorial,
  );
  const shouldBeOpen = isSelectionActive();
  const [isOpenTutoPopup, handleToggleTutoPopup] = usePopup(
    shouldShowTutorial && shouldBeOpen,
  );

  useTitle(titles.featureGroups);

  return (
    <>
      <BasketTutoPopup
        isOpen={isOpenTutoPopup}
        handleToggle={handleToggleTutoPopup}
      />
      <Flex flexDirection="column">
        <Flex alignItems="center">
          <Input
            labelProps={{ flexGrow: 1, mr: '8px' }}
            variant="white"
            disabled={!maxVersionsData.length}
            value={search}
            placeholder="Find a feature group..."
            onChange={handleSearchChange}
          />
          {!!labels.length && (
            <Tooltip
              mr="8px"
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
                href={getHref(
                  routeNames.featureGroup.create,
                  routeNames.project.view,
                )}
                disabled={!canEdit || isPermissionsLoading}
                onClick={handleCreate}
              >
                New Feature Group
              </Button>
            </Tooltip>
          </Box>
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
          </Flex>
          <Flex ml="auto" alignItems="center">
            <Select
              width="150px"
              variant="white"
              value={sort}
              listWidth="100%"
              mr="10px"
              disabled={isKeywordsAndLastUpdateLoading || isLoading}
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
          <FeatureGroupListContent
            data={dataResult}
            loading={isKeywordsAndLastUpdateLoading}
            isFiltered={maxVersionsData.length !== dataResult.length}
            onResetFilters={handleResetFilters}
          />
        )}
        {!isLoading && !maxVersionsData.length && (
          <NoData
            mainText={
              hasSharedFS
                ? 'No Feature Groups for the selected feature store'
                : 'No Feature Groups'
            }
            secondaryText={
              hasSharedFS
                ? 'You can create a feature group from the UI or in a program. You can also select another feature store'
                : 'You can create a feature group from the UI or in a program'
            }
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
            <Tooltip
              mainText="You have no edit right on the feature store"
              disabled={canEdit && !isPermissionsLoading}
            >
              <Button
                href={buildHref(
                  routeNames.featureGroup.create,
                  routeNames.project.view,
                )}
                disabled={!canEdit || isPermissionsLoading}
                onClick={handleCreate}
              >
                New Feature Group
              </Button>
            </Tooltip>
          </NoData>
        )}
      </Flex>
    </>
  );
};

export default FeatureGroupList;
