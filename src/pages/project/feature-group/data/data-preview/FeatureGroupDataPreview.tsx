// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Flex } from 'rebass';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ReadOnlyTable,
  Symbol,
  SymbolMode,
  Value,
} from '@logicalclocks/quartz';

import routeNames from '../../../../../routes/routeNames';

// Components
import Loader from '../../../../../components/loader/Loader';
import Panel from '../../../../../components/panel/Panel';
import FeatureFilters, { sortKeys } from './FeatureFilters';
// Types
import { Dispatch, RootState } from '../../../../../store';
import { Feature } from '../../../../../types/feature';
import { StorageConnectorType } from '../../../../../types/feature-group-data-preview';
import { FeatureGroupViewState } from '../../../../../store/models/feature/featureGroupView.model';
// Hooks
import useFeatureFilter from '../../hooks/useFeatureFilters';
// Utils
import sort from '../../../../../utils/sort';
import createDataPreviewRows from './utils/createDataPreviewRows';
import filterDataPreviewRows from './utils/filterDataPreviewRows';
import FilterResult from '../../../../../components/filter-result/FilterResult';
// Selectors
import { selectFeatureStoreData } from '../../../../../store/models/feature/selectors';
import { ItemDrawerTypes } from '../../../../../components/drawer/ItemDrawer';
import useBasket from '../../../../../hooks/useBasket';
import useTitle from '../../../../../hooks/useTitle';
import titles from '../../../../../sources/titles';
import useFeatureGroupView from '../../hooks/useFeatureGroupView';
import FeatureDrawer from '../../../../../components/feature-drawer/FeatureDrawer';
import useDrawer from '../../../../../hooks/useDrawer';
import NoData from '../../../../../components/no-data/NoData';
import getHrefNoMatching from '../../../../../utils/getHrefNoMatching';

const FeatureGroupDataPreview: FC = () => {
  const { id, fgId, fsId } = useParams();

  const { data: featureGroupData } = useFeatureGroupView(+id, +fgId, +fsId);

  const { data: featureStoreData } = useSelector(selectFeatureStoreData);

  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const [storageConnectorType, setType] = useState<StorageConnectorType>(
    StorageConnectorType.offline,
  );

  const [[sortKey], setSortKey] = useState<string[]>(['name (A -> Z)']);

  const { featureName } = useParams();

  const [staticColumn, setStaticColumn] = useState<string | undefined>(
    featureName,
  );

  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      dispatch.featureGroupRows.clear();
      dispatch.featureGroupView.clear();
    };
  }, [dispatch]);

  useEffect(() => {
    const load = async () => {
      await dispatch.featureGroupDataPreview.fetch({
        projectId: +id,
        featureStoreId: +fsId,
        featureGroupId: +fgId,
        storage: storageConnectorType,
      });

      setIsFirstLoad(false);
    };
    load();
  }, [id, fgId, dispatch, storageConnectorType, featureStoreData, fsId]);

  const handleRefreshData = useCallback(() => {
    dispatch.featureGroupDataPreview.fetch({
      projectId: +id,
      featureStoreId: +fsId,
      featureGroupId: +fgId,
      storage: storageConnectorType,
    });
  }, [dispatch.featureGroupDataPreview, id, fsId, fgId, storageConnectorType]);

  const view = useSelector<RootState, FeatureGroupViewState>(
    (state) => state.featureGroupView,
  );

  const { isOpen, selectedName, handleSelectItemByName, handleClose } =
    useDrawer();

  const data = useSelector((state: RootState) => state.featureGroupRows);

  const isLoading = useSelector(
    (state: RootState) => state.loading.effects.featureGroupDataPreview.fetch,
  );

  const handleChangeStaticColumn = useCallback(
    (column: string | undefined = undefined) => {
      setStaticColumn(column);
    },
    [],
  );

  const handleNavigate = useCallback(
    (route: string) => (): void => {
      navigate(
        getHrefNoMatching(route, routeNames.project.value, true, {
          fsId,
          fgId,
          id,
        }),
      );
    },
    [id, fgId, fsId, navigate],
  );

  const [selectColumn, setSelectColumn] = useState(null);

  const selectedItem = (selectedName: string, featureGroupData: any) => {
    const item = JSON.parse(JSON.stringify(featureGroupData));
    if (item) {
      item.features = item.features.filter(
        ({ name }: any) => name === selectedName,
      );
      item.name = selectedName;
    }
    setSelectColumn(item);
  };

  const handleSelectItem = useCallback(
    (selectedName) => {
      handleSelectItemByName(selectedName);
      selectedItem(selectedName, featureGroupData);
    },
    [featureGroupData, handleSelectItemByName],
  );

  const features = useMemo(() => view?.features || [], [view]);
  const sortedFeatures = useMemo(() => {
    const key = sortKeys[sortKey];
    if (key) {
      const [k, func, direction] = key;

      return sort<Feature>(k, func, direction)(features.slice());
    }

    return features;
  }, [features, sortKey]);

  const computedData = useMemo(
    () => (data ? createDataPreviewRows(sortedFeatures, data) : []),
    [data, sortedFeatures],
  );

  const {
    dataFiltered: filteredFeatures,
    types,
    search,
    typeFilters,
    keyFilter,
    onReset,
    onTypeFiltersChange,
    onSearchChange,
    onToggleKey,
  } = useFeatureFilter(sortedFeatures);

  const { isActiveFeatures, handleBasket, isSwitch } = useBasket();

  const filteredData = useMemo(
    () => filterDataPreviewRows(filteredFeatures, computedData),
    [filteredFeatures, computedData],
  );

  const statistics = useSelector(
    (state: RootState) => state.featureGroupStatistics?.entities.statistics,
  );

  const featuresLength = features.length;
  const displayFeaturesLength = filteredFeatures.length;
  const isFiltered = featuresLength !== displayFeaturesLength;

  useTitle(`${titles.dataPreview} ${view?.name}`);

  if (!view || (isLoading && isFirstLoad)) {
    return <Loader />;
  }

  return (
    <>
      {!!selectedName && !!selectColumn && featureGroupData && (
        <FeatureDrawer
          isOpen={isOpen}
          fgId={featureGroupData.id}
          feature={selectColumn}
          handleToggle={handleClose}
          projectId={+id}
          featureStoreId={+fsId}
        />
      )}
      <Box
        display="grid"
        sx={{
          gridTemplateRows: '130px 50px minmax(120px, 100%)',
          height: 'calc(100vh - 115px)',
        }}
      >
        <Panel
          type={ItemDrawerTypes.fg}
          data={view}
          title={view?.name}
          id={view?.id}
          idColor="labels.orange"
          onClickEdit={handleNavigate(routeNames.featureGroup.edit)}
          onClickRefresh={handleRefreshData}
        />
        <FeatureFilters
          search={search}
          typeFilters={typeFilters}
          types={types}
          keyFilter={keyFilter}
          storageConnectorType={storageConnectorType}
          enableStorageConnectorFilter={
            featureGroupData ? featureGroupData.onlineEnabled : true
          }
          setType={setType}
          sortKey={sortKey}
          setSortKey={setSortKey}
          onToggleKey={onToggleKey}
          onSearchChange={onSearchChange}
          onTypeFiltersChange={onTypeFiltersChange}
        />
        {!isLoading && (
          <Flex>
            <Value primary px="5px">
              {displayFeaturesLength}
            </Value>
            <Value>out of</Value>
            <Value primary px="5px">
              {featuresLength}
            </Value>
            <Value>features displayed</Value>
            {isSwitch && (
              <Box ml="5px" mt="-3px">
                <Symbol
                  mode={SymbolMode.bulk}
                  possible={filteredFeatures.length > 0}
                  tooltipMainText="Add all features to basket"
                  tooltipSecondaryText={`${filteredFeatures.length} features`}
                  handleClick={handleBasket(filteredFeatures, view)}
                  inBasket={isActiveFeatures(filteredFeatures, view)}
                />
              </Box>
            )}
          </Flex>
        )}
        {!!filteredFeatures.length && !!filteredData.length && !isLoading && (
          <Box mb="-23px" mr="-18px" maxWidth="100vw">
            <ReadOnlyTable
              staticColumn={staticColumn}
              onFreeze={handleChangeStaticColumn}
              values={filteredData}
              actions={[
                {
                  label: 'statistics',
                  handler: handleSelectItem,
                },
              ]}
            />
          </Box>
        )}
        {(!filteredFeatures.length || !filteredData.length || !!statistics) && (
          <NoData mainText="No data available" />
        )}
        {isLoading && <Loader />}
        {isFiltered && !filteredFeatures.length && !isLoading && (
          <Box mb="20px">
            <FilterResult
              subject="features"
              result={filteredFeatures.length}
              onReset={onReset}
            />
          </Box>
        )}
      </Box>
    </>
  );
};

export default FeatureGroupDataPreview;
