import { format } from 'date-fns';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Select } from '@logicalclocks/quartz';
import routeNames from '../../../../routes/routeNames';
import NoData from '../../../../components/no-data/NoData';
import React, { FC, useCallback, useEffect, useMemo } from 'react';

// Types
import { Dispatch, RootState } from '../../../../store';
// Hooks
import useFeatureGroupView from '../hooks/useFeatureGroupView';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
// Components
import StatisticsContent from './StatisticsContent';
import Panel from '../../../../components/panel/Panel';
import Loader from '../../../../components/loader/Loader';
// Selectors
import { selectFeatureStoreData } from '../../../../store/models/feature/selectors';
import { ItemDrawerTypes } from '../../../../components/drawer/ItemDrawer';
import useTitle from '../../../../hooks/useTitle';
import titles from '../../../../sources/titles';

const FeatureGroupStatistics: FC = () => {
  const { id, fgId, featureName, commitTime } = useParams();

  const { data: featureStoreData } = useSelector(selectFeatureStoreData);

  const statistics = useSelector(
    (state: RootState) => state.featureGroupStatistics?.entities.statistics,
  );

  const commits = useSelector(
    (state: RootState) => state.featureGroupStatisticsCommits,
  );

  const lastCommit = useMemo(() => {
    return commits.sort((c1, c2) => -c1.localeCompare(c2))[0];
  }, [commits]);

  const choices = useMemo(
    () =>
      commits.map(
        (c) =>
          `${format(+c, 'M.d.yyyy - HH:mm:ss')}${
            c === lastCommit ? ' (latest)' : ''
          }`,
      ),
    [commits, lastCommit],
  );

  const commit = useMemo(() => {
    let time = commitTime;
    if (lastCommit) {
      if (!time || time === lastCommit) {
        time = `${format(+lastCommit, 'M.d.yyyy - HH:mm:ss')} (latest)`;
      } else if (Number.isInteger(+time)) {
        time = format(+time, 'M.d.yyyy - HH:mm:ss');
      }
    }
    return time;
  }, [commitTime, lastCommit]);

  const isStatisticsLoading = useSelector(
    (state: RootState) => state.loading.effects.featureGroupStatistics.fetch,
  );

  const { data, isLoading } = useFeatureGroupView(+id, +fgId);

  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigateRelative();

  const handleRefreshData = useCallback(() => {
    if (featureStoreData?.featurestoreId) {
      dispatch.featureGroupStatisticsCommits.fetch({
        projectId: +id,
        featureStoreId: featureStoreData.featurestoreId,
        featureGroupId: +fgId,
      });
      dispatch.featureGroupStatistics.fetch({
        projectId: +id,
        featureStoreId: featureStoreData.featurestoreId,
        featureGroupId: +fgId,
        timeCommit: commitTime,
      });
    }
  }, [id, fgId, dispatch, featureStoreData, commitTime]);

  const navigateToStatistics = useCallback(
    (timeString, id = fgId) => {
      let normalizedTime = timeString;

      if (timeString.includes('(latest)')) {
        normalizedTime = timeString.slice(0, timeString.indexOf(' (latest)'));
      }

      const time = commits.find(
        (c) => format(+c, 'M.d.yyyy - HH:mm:ss') === normalizedTime,
      );

      const currentTime = commits.find((c) => {
        const formatted = format(+c, 'M.d.yyyy - HH:mm:ss');

        return formatted === commit || `${formatted} (latest)` === commit;
      });

      if (time && currentTime !== time) {
        if (featureName) {
          navigate(
            `/${id}/statistics/commit/${time}/f/${featureName}`,
            'p/:id/fg/*',
          );
        } else {
          navigate(`/${id}/statistics/commit/${time}`, 'p/:id/fg/*');
        }
      }
    },
    [featureName, commits, navigate, fgId, commit],
  );

  const handleCommitChange = useCallback(
    (values) => {
      let [timeString] = values;

      navigateToStatistics(timeString);
    },
    [navigateToStatistics],
  );

  useEffect(() => {
    if (featureStoreData?.featurestoreId) {
      dispatch.featureGroupStatisticsCommits.fetch({
        projectId: +id,
        featureStoreId: featureStoreData.featurestoreId,
        featureGroupId: +fgId,
      });
      dispatch.featureGroupStatistics.fetch({
        projectId: +id,
        featureStoreId: featureStoreData.featurestoreId,
        featureGroupId: +fgId,
        timeCommit: commitTime,
      });
    }

    return () => {
      dispatch.featureGroupStatistics.clear();
      dispatch.featureGroupRows.clear();
    };
  }, [id, fgId, dispatch, featureStoreData, commitTime]);

  const latestVersion = useMemo(
    () => Math.max(...(data?.versions.map(({ version }) => version) || [])),
    [data],
  );

  const versions = useMemo(() => {
    return (
      data?.versions.map(
        ({ version }) =>
          `${version} ${version === latestVersion ? '(latest)' : ''}`,
      ) || []
    );
  }, [data, latestVersion]);

  const handleVersionChange = useCallback(
    (values) => {
      const newId = data?.versions.find(({ version }) => version === values[0])
        ?.id;

      navigateToStatistics(commit, newId);
    },
    [data, commit, navigateToStatistics],
  );

  useTitle(`${titles.statistics} - ${data?.name}`);

  if (isLoading || isStatisticsLoading) {
    return <Loader />;
  }

  if (!data?.features.length) {
    return (
      <NoData mainText="No Features" secondaryText="">
        <Button
          intent="secondary"
          onClick={() => navigate(routeNames.featureGroup.list, 'p/:id/*')}
        >
          Feature Groups
        </Button>
      </NoData>
    );
  }

  if (!statistics) {
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
        type={ItemDrawerTypes.fg}
        data={data}
        title={data.name}
        id={data.id}
        idColor="labels.orange"
        onClickEdit={() => ({})}
        onClickRefresh={handleRefreshData}
        hasCommitDropdown={true}
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
        commitDropdown={
          <Select
            mb="-5px"
            width="280px"
            listWidth="100%"
            value={[commit]}
            options={choices}
            placeholder="commit time"
            onChange={handleCommitChange}
          />
        }
      />
      {isStatisticsLoading ? (
        <Loader />
      ) : (
        <StatisticsContent
          data={data}
          statistics={statistics}
          view={featureName}
        />
      )}
    </>
  );
};

export default FeatureGroupStatistics;
