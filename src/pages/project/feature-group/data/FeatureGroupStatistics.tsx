// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Select } from '@logicalclocks/quartz';
import NoData from '../../../../components/no-data/NoData';

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
import { ItemDrawerTypes } from '../../../../components/drawer/ItemDrawer';
import useTitle from '../../../../hooks/useTitle';
import titles from '../../../../sources/titles';

const dateFormat = 'yyyy-MM-dd HH:mm:ss';

const FeatureGroupStatistics: FC = () => {
  const { id, fsId, fgId, featureName, commitTime } = useParams();

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
          `${format(+c, dateFormat)}${c === lastCommit ? ' (latest)' : ''}`,
      ),
    [commits, lastCommit],
  );

  const commit = useMemo(() => {
    let time = commitTime;
    if (lastCommit) {
      if (!time || time === lastCommit) {
        time = `${format(+lastCommit, dateFormat)} (latest)`;
      } else if (Number.isInteger(+time)) {
        time = format(+time, dateFormat);
      }
    }
    return time;
  }, [commitTime, lastCommit]);

  const isStatisticsLoading = useSelector(
    (state: RootState) => state.loading.effects.featureGroupStatistics.fetch,
  );

  const { data, isLoading } = useFeatureGroupView(+id, +fgId, +fsId);

  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigateRelative();

  const handleRefreshData = useCallback(() => {
    dispatch.featureGroupStatisticsCommits.fetch({
      projectId: +id,
      featureStoreId: +fsId,
      featureGroupId: +fgId,
    });
    dispatch.featureGroupStatistics.fetch({
      projectId: +id,
      featureStoreId: +fsId,
      featureGroupId: +fgId,
      timeCommit: commitTime,
    });
  }, [
    dispatch.featureGroupStatisticsCommits,
    dispatch.featureGroupStatistics,
    id,
    fsId,
    fgId,
    commitTime,
  ]);

  const navigateToStatistics = useCallback(
    (timeString, id = fgId) => {
      let normalizedTime = timeString;

      if (timeString.includes('(latest)')) {
        normalizedTime = timeString.slice(0, timeString.indexOf(' (latest)'));
      }

      const time = commits.find(
        (c) => format(+c, dateFormat) === normalizedTime,
      );

      const currentTime = commits.find((c) => {
        const formatted = format(+c, dateFormat);

        return formatted === commit || `${formatted} (latest)` === commit;
      });

      if (time && currentTime !== time) {
        if (featureName) {
          navigate(
            `/${id}/statistics/commit/${time}/f/${featureName}`,
            'p/:id/fs/:fsId/fg/*',
          );
        } else {
          navigate(`/${id}/statistics/commit/${time}`, 'p/:id/fs/:fsId/fg/*');
        }
      }
    },
    [featureName, commits, navigate, fgId, commit],
  );

  const handleCommitChange = useCallback(
    (values) => {
      const [timeString] = values;

      navigateToStatistics(timeString);
    },
    [navigateToStatistics],
  );

  useEffect(() => {
    dispatch.featureGroupStatisticsCommits.fetch({
      projectId: +id,
      featureStoreId: +fsId,
      featureGroupId: +fgId,
    });
    dispatch.featureGroupStatistics.fetch({
      projectId: +id,
      featureStoreId: +fsId,
      featureGroupId: +fgId,
      timeCommit: commitTime,
    });

    return () => {
      dispatch.featureGroupRows.clear();
    };
  }, [id, fgId, dispatch, fsId, commitTime]);

  const latestVersion = useMemo(
    () => Math.max(...(data?.versions?.map(({ version }) => version) || [])),
    [data],
  );

  const versions = useMemo(() => {
    return (
      data?.versions?.map(
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
        navigateToStatistics(commit, newId);
      }
    },
    [data, commit, navigateToStatistics],
  );

  useTitle(`${titles.statistics} ${data?.name ? ` - ${data.name}` : ''}`);

  if (isLoading || isStatisticsLoading) {
    return <Loader />;
  }

  return (
    <>
      <Panel
        type={ItemDrawerTypes.fg}
        data={data}
        title={data?.name}
        id={data?.id}
        idColor="labels.orange"
        onClickEdit={() => navigate(`/edit`, 'p/:id/fs/:fsId/fg/:fgId/*')}
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
      {!data?.features.length || !statistics ? (
        <NoData mainText="No data available" />
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
