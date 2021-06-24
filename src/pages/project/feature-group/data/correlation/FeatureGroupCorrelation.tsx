// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Select } from '@logicalclocks/quartz';

// Types
import { Dispatch, RootState } from '../../../../../store';
// Components
import Panel from '../../../../../components/panel/Panel';
import Loader from '../../../../../components/loader/Loader';
import NoData from '../../../../../components/no-data/NoData';
import Correlation from '../../../../../components/correlation/Correlation';
// Hooks
import useFeatureGroupView from '../../hooks/useFeatureGroupView';
import useNavigateRelative from '../../../../../hooks/useNavigateRelative';
// Selectors
import { selectFeatureStoreData } from '../../../../../store/models/feature/selectors';

import routeNames from '../../../../../routes/routeNames';
import useTitle from '../../../../../hooks/useTitle';
import titles from '../../../../../sources/titles';
import { ItemDrawerTypes } from '../../../../../components/drawer/ItemDrawer';

const FeatureGroupCorrelation: FC = () => {
  const { id, fgId } = useParams();

  const { data: featureStoreData } = useSelector(selectFeatureStoreData);

  const statistics = useSelector(
    (state: RootState) => state.featureGroupStatistics?.entities.statistics,
  );

  const isStatisticsLoading = useSelector(
    (state: RootState) => state.loading.effects.featureGroupStatistics.fetch,
  );

  const { isLoading, data } = useFeatureGroupView(+id, +fgId);

  const navigate = useNavigateRelative();
  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    if (featureStoreData?.featurestoreId) {
      dispatch.featureGroupStatistics.fetch({
        projectId: +id,
        featureStoreId: featureStoreData.featurestoreId,
        featureGroupId: +fgId,
      });
    }

    return () => {
      dispatch.featureGroupStatistics.clear();
      dispatch.featureGroupRows.clear();
    };
  }, [id, fgId, dispatch, featureStoreData]);

  const handleRefreshData = useCallback(() => {
    if (featureStoreData?.featurestoreId) {
      dispatch.featureGroupStatistics.fetch({
        projectId: +id,
        featureStoreId: featureStoreData.featurestoreId,
        featureGroupId: +fgId,
      });
    }
  }, [id, fgId, dispatch, featureStoreData]);

  const latestVersion = useMemo(
    () => Math.max(...(data?.versions?.map(({ version }) => version) || [])),
    [data],
  );

  const versions = useMemo(() => {
    return (
      data?.versions
        .sort((versionA, versionB) =>
          Math.sign(versionA.version - versionB.version),
        )
        .map(
          ({ version }) =>
            `${version} ${version === latestVersion ? '(latest)' : ''}`,
        ) || []
    );
  }, [data, latestVersion]);

  const handleVersionChange = useCallback(
    (values) => {
      const ver = values[0].includes(' ')
        ? +values[0].slice(0, values[0].indexOf(' '))
        : +values[0];

      const newId = data?.versions?.find(({ version }) => version === ver)?.id;

      if (newId) {
        navigate(`/${newId}/correlation`, '/p/:id/fg/*');
      }
    },
    [data, navigate],
  );

  useTitle(`${titles.correlation} ${data?.name ? data.name : 'Feature group'}`);

  if (isLoading || isStatisticsLoading || !data) {
    return <Loader />;
  }

  if (
    !statistics ||
    Object.values(statistics).some(({ correlations }) => !correlations)
  ) {
    return (
      <NoData mainText="No Feature Statistics" secondaryText="">
        <Button
          intent="secondary"
          onClick={() => navigate(routeNames.featureGroup.list, 'p/:id/*')}
        >
          Feature Groups
        </Button>
      </NoData>
    );
  }

  return (
    <>
      <Panel
        title={data.name}
        id={data.id}
        idColor="labels.orange"
        onClickEdit={() => navigate(`/edit`, 'p/:id/fg/:fgId/*')}
        onClickRefresh={handleRefreshData}
        hasVersionDropdown={true}
        versionDropdown={
          <Select
            mb="-5px"
            width="143px"
            mr="10px"
            listWidth="100%"
            value={[
              `${data?.version.toString()} ${
                data?.version === latestVersion ? '(latest)' : ''
              }`,
            ]}
            options={versions}
            placeholder="version"
            onChange={handleVersionChange}
          />
        }
      />
      <Correlation
        item={data}
        correlation={statistics}
        type={ItemDrawerTypes.fg}
      />
    </>
  );
};

export default FeatureGroupCorrelation;
