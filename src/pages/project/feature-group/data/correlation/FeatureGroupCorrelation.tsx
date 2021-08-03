// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Select } from '@logicalclocks/quartz';

// Types
import { Dispatch, RootState } from '../../../../../store';
import { ItemDrawerTypes } from '../../../../../components/drawer/ItemDrawer';
// Components
import Panel from '../../../../../components/panel/Panel';
import Loader from '../../../../../components/loader/Loader';
import NoData from '../../../../../components/no-data/NoData';
import Correlation from '../../../../../components/correlation/Correlation';
// Hooks
import useFeatureGroupView from '../../hooks/useFeatureGroupView';
import useNavigateRelative from '../../../../../hooks/useNavigateRelative';
import useTitle from '../../../../../hooks/useTitle';
// Utils
import titles from '../../../../../sources/titles';

const FeatureGroupCorrelation: FC = () => {
  const { id, fsId, fgId } = useParams();

  const statistics = useSelector(
    (state: RootState) => state.featureGroupStatistics?.entities.statistics,
  );

  const isStatisticsLoading = useSelector(
    (state: RootState) => state.loading.effects.featureGroupStatistics.fetch,
  );

  const { isLoading, data } = useFeatureGroupView(+id, +fgId, +fsId);

  const navigate = useNavigateRelative();
  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    dispatch.featureGroupStatistics.fetch({
      projectId: +id,
      featureStoreId: +fsId,
      featureGroupId: +fgId,
    });

    return () => {
      dispatch.featureGroupStatistics.clear();
      dispatch.featureGroupRows.clear();
    };
  }, [id, fgId, dispatch, fsId]);

  const handleRefreshData = useCallback(() => {
    dispatch.featureGroupStatistics.fetch({
      projectId: +id,
      featureStoreId: +fsId,
      featureGroupId: +fgId,
    });
  }, [id, fgId, dispatch, fsId]);

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
        navigate(`/${newId}/correlation`, '/p/:id/fs/:fdId/fg/*');
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
    return <NoData mainText="No Feature Statistics" secondaryText="" />;
  }

  return (
    <>
      <Panel
        title={data.name}
        id={data.id}
        idColor="labels.orange"
        onClickEdit={() => navigate(`/edit`, 'p/:id/fs/:fsId/fg/:fgId/*')}
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
