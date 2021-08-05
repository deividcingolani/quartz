// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, dateFormat, Select } from '@logicalclocks/quartz';
import routeNames from '../../../../routes/routeNames';
// Types
import { Dispatch, RootState } from '../../../../store';
import { ItemDrawerTypes } from '../../../../components/drawer/ItemDrawer';
// Hooks
import useTrainingDatasetView from '../hooks/useTrainingDatasetView';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import useTitle from '../../../../hooks/useTitle';
// Components
import Panel from '../../../../components/panel/Panel';
import Loader from '../../../../components/loader/Loader';
import NoData from '../../../../components/no-data/NoData';
import Correlation from '../../../../components/correlation/Correlation';
// Utils
import titles from '../../../../sources/titles';
import { useVersionsSort } from '../utils';
import { TrainingDatasetStatistics as TdStatisticsType } from '../../../../store/models/training-dataset/statistics/trainingDatasetStatistics.model';

const TrainingDatasetCorrelation: FC = () => {
  const { id, fsId, tdId, commitTime, split } = useParams();

  const statisticsState = useSelector(
    (state: RootState) => state.trainingDatasetStatistics,
  );

  const isStatisticsLoading = useSelector(
    (state: RootState) => state.loading.effects.trainingDatasetStatistics.fetch,
  );

  const commits = useSelector(
    (state: RootState) => state.trainingDatasetStatisticsCommits,
  );

  const { data, isLoading } = useTrainingDatasetView(+id, +tdId);

  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigateRelative();

  const choices = useMemo(
    () =>
      commits.map(
        (c) =>
          `${format(+c, dateFormat)}${c === commits[0] ? ' (latest)' : ''}`,
      ),
    [commits],
  );

  const commit = useMemo(() => {
    let time = commitTime;
    if (commits) {
      if (!time || time === commits[0]) {
        time = `${format(+commits[0], dateFormat)} (latest)`;
      } else if (Number.isInteger(+time)) {
        time = format(+time, dateFormat);
      }
    }
    return time;
  }, [commitTime, commits]);

  const navigateToStatistics = useCallback(
    (timeString, splitName, id = +tdId) => {
      let normalizedTime = timeString;

      if (timeString.includes('(latest)')) {
        normalizedTime = timeString.slice(0, timeString.indexOf(' (latest)'));
      }

      const time = commits.find(
        (c) => format(+c, dateFormat) === normalizedTime,
      );

      let targetUri = `/${id}/correlation`;
      if (id !== +tdId) {
        // version change ignore commit/split settings
        navigate(targetUri, 'p/:id/fs/:fsId/td/*');
      } else {
        if (time) {
          targetUri = `${targetUri}/commit/${time}`;
        }
        if (splitName) {
          targetUri = `${targetUri}/split/${splitName}`;
        }

        navigate(targetUri, '/p/:id/fs/:fsId/td/*');
      }
    },
    [commits, navigate, tdId],
  );

  const handleCommitChange = useCallback(
    (values) => {
      const [timeString] = values;

      navigateToStatistics(timeString, split);
    },
    [navigateToStatistics, split],
  );

  const handleRefreshData = useCallback(() => {
    dispatch.trainingDatasetStatisticsCommits.fetch({
      projectId: +id,
      featureStoreId: +fsId,
      trainingDatasetId: +tdId,
    });
    dispatch.trainingDatasetStatistics.fetch({
      projectId: +id,
      featureStoreId: +fsId,
      trainingDatasetId: +tdId,
      timeCommit: commitTime,
    });
  }, [id, fsId, tdId, dispatch, commitTime]);

  useEffect(() => {
    dispatch.trainingDatasetStatisticsCommits.fetch({
      projectId: +id,
      featureStoreId: +fsId,
      trainingDatasetId: +tdId,
    });
    dispatch.trainingDatasetStatistics.fetch({
      projectId: +id,
      featureStoreId: +fsId,
      trainingDatasetId: +tdId,
      timeCommit: commitTime,
    });

    return () => {
      dispatch.trainingDatasetStatistics.clear();
    };
  }, [id, tdId, dispatch, fsId, commitTime]);

  const latestVersion = useMemo(
    () => Math.max(...(data?.versions?.map(({ version }) => version) || [])),
    [data],
  );

  const versions = useVersionsSort(data, latestVersion);

  const handleVersionChange = useCallback(
    (values) => {
      const ver = values[0].includes(' ')
        ? +values[0].slice(0, values[0].indexOf(' '))
        : +values[0];

      const newId = data?.versions?.find(({ version }) => version === ver)?.id;

      navigateToStatistics(commit, split, newId);
    },
    [data, commit, split, navigateToStatistics],
  );

  const splitNames =
    statisticsState && statisticsState instanceof Map
      ? Array.from(statisticsState.keys()).sort((a, b) => (a > b ? 1 : -1))
      : [];

  let statistics = null;
  if (statisticsState) {
    if (statisticsState instanceof Map) {
      statistics = (statisticsState as Map<string, TdStatisticsType>).get(
        split || splitNames[0],
      )?.entities.statistics;
    } else {
      statistics = (statisticsState as TdStatisticsType)?.entities.statistics;
    }
  }

  const handleSplitChange = useCallback(
    (values) => {
      const [splitName] = values;

      navigateToStatistics(commit, splitName);
    },
    [navigateToStatistics, commit],
  );

  useTitle(
    `${titles.correlation} ${data?.name ? data.name : 'Training dataset'}`,
  );

  if (isLoading || isStatisticsLoading || !data) {
    return <Loader />;
  }

  if (!data?.features.length) {
    return (
      <NoData mainText="No Features" secondaryText="">
        <Button
          intent="secondary"
          onClick={() =>
            navigate(routeNames.trainingDataset.list, 'p/:id/fs/:fsId/*')
          }
        >
          Training Datasets
        </Button>
      </NoData>
    );
  }

  if (
    !statistics ||
    Object.values(statistics).some(({ correlations }) => !correlations)
  ) {
    return (
      <NoData mainText="No Feature Statistics" secondaryText="">
        <Button
          intent="secondary"
          onClick={() =>
            navigate(routeNames.trainingDataset.list, 'p/:id/fs/:fsId/*')
          }
        >
          Training Datasets
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
        onClickEdit={() => ({})}
        onClickRefresh={handleRefreshData}
        hasVersionDropdown={true}
        hasCommitDropdown={true}
        hasSplitDropdown={splitNames.length > 0}
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
            mr="10px"
            width="280px"
            listWidth="100%"
            value={[commit]}
            options={choices}
            placeholder="commit time"
            onChange={handleCommitChange}
          />
        }
        splitDropdown={
          splitNames ? (
            <Select
              mb="-5px"
              width="140px"
              listWidth="100%"
              value={[split || splitNames[0]]}
              options={splitNames}
              placeholder="split"
              onChange={handleSplitChange}
            />
          ) : (
            <></>
          )
        }
      />
      <Correlation
        item={data}
        correlation={statistics}
        type={ItemDrawerTypes.td}
      />
    </>
  );
};

export default TrainingDatasetCorrelation;
