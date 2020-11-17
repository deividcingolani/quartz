import { Box, Flex } from 'rebass';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ReadOnlyTable, Value } from '@logicalclocks/quartz';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import routeNames from '../../../../../routes/routeNames';

// Components
import Loader from '../../../../../components/loader/Loader';
import Panel from '../../../../../components/panel/Panel';
import FeatureFilters, { sortKeys } from './FeatureFilters';
// Types
import { Dispatch, RootState } from '../../../../../store';
import { Feature } from '../../../../../types/feature-group';
import { StorageConnectorType } from '../../../../../types/feature-group-data-preview';
import { FeatureGroupViewState } from '../../../../../store/models/feature/featureGroupView.model';
// Hooks
import useFeatureFilter from '../../hooks/useFeatureFilters';
import useNavigateRelative from '../../../../../hooks/useNavigateRelative';
// Utils
import sort from '../../../../../utils/sort';
import createDataPreviewRows from './utils/createDataPreviewRows';
import filterDataPreviewRows from './utils/filterDataPreviewRows';
import FilterResult from '../../../../../components/filter-result/FilterResult';

const FeatureGroupDataPreview: FC = () => {
  const { id, fgId } = useParams();

  const [storageConnectorType, setType] = useState<StorageConnectorType>(
    StorageConnectorType.offline,
  );

  const [[sortKey], setSortKey] = useState<string[]>(['default order']);

  const { featureName } = useParams();

  const [staticColumn, setStaticColumn] = useState<string | undefined>(
    featureName,
  );

  const dispatch = useDispatch<Dispatch>();

  const navigate = useNavigateRelative();

  useEffect(() => {
    dispatch.featureGroupDataPreview.fetch({
      projectId: +id,
      featureStoreId: 67,
      featureGroupId: +fgId,
      storage: StorageConnectorType.offline,
    });

    return () => {
      dispatch.featureGroupRows.clear();
      dispatch.featureGroupView.clear();
    };
  }, [id, fgId, dispatch, storageConnectorType]);

  const handleRefreshData = useCallback(() => {
    dispatch.featureGroupDataPreview.fetch({
      projectId: +id,
      featureStoreId: 67,
      featureGroupId: +fgId,
      storage: StorageConnectorType.offline,
    });
  }, [id, fgId, dispatch]);

  const view = useSelector<RootState, FeatureGroupViewState>(
    (state) => state.featureGroupView,
  );

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
      navigate(route.replace(':fgId', fgId), routeNames.project.view);
    },
    [fgId, navigate],
  );

  const handleNavigateToStats = useCallback(
    (stateName: string) => {
      navigate(
        `${routeNames.featureGroup.statistics.replace(
          ':fgId',
          fgId,
        )}/f/${stateName}`,
        routeNames.project.view,
      );
    },
    [fgId, navigate],
  );

  const features = view?.features || [];

  const sortedFeatures = useMemo(() => {
    const key = sortKeys[sortKey];
    if (key) {
      const [k, func] = key;

      return sort<Feature>(k, func)(features.slice());
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

  const filteredData = useMemo(
    () => filterDataPreviewRows(filteredFeatures, computedData),
    [filteredFeatures, computedData],
  );

  const featuresLength = features.length;
  const displayFeaturesLength = filteredFeatures.length;
  const isFiltered = featuresLength !== displayFeaturesLength;

  if (isLoading || !view) {
    return <Loader />;
  }

  return (
    <Box
      display="grid"
      sx={{
        gridTemplateRows: '130px 50px minmax(120px, max-content)',
        height: 'calc(100vh - 115px)',
      }}
    >
      <Panel
        title={view?.name}
        id={view?.id}
        onClickEdit={handleNavigate(routeNames.featureGroup.edit)}
        onClickRefresh={handleRefreshData}
      />
      <FeatureFilters
        search={search}
        typeFilters={typeFilters}
        types={types}
        keyFilter={keyFilter}
        storageConnectorType={storageConnectorType}
        setType={setType}
        sortKey={sortKey}
        setSortKey={setSortKey}
        onToggleKey={onToggleKey}
        onSearchChange={onSearchChange}
        onTypeFiltersChange={onTypeFiltersChange}
      />
      <Flex>
        <Value primary px="5px">
          {displayFeaturesLength}
        </Value>
        <Value>features displayed out of</Value>
        <Value primary px="5px">
          {featuresLength}
        </Value>
        <Value>features</Value>
      </Flex>
      <Box mb="10px" maxWidth="100vw">
        {!!filteredFeatures.length && filteredData.length && (
          <ReadOnlyTable
            staticColumn={staticColumn}
            onFreeze={handleChangeStaticColumn}
            values={filteredData}
            actions={[
              {
                label: 'statistics',
                handler: handleNavigateToStats,
              },
            ]}
          />
        )}
      </Box>
      {isFiltered && (
        <Box mb="20px">
          <FilterResult
            subject="features"
            result={filteredFeatures.length}
            onReset={onReset}
          />
        </Box>
      )}
    </Box>
  );
};

export default FeatureGroupDataPreview;
