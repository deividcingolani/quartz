// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, dateFormat, Select } from '@logicalclocks/quartz';
import routeNames from '../../../../routes/routeNames';
import NoData from '../../../../components/no-data/NoData';

// Types
import { Dispatch, RootState } from '../../../../store';
import { ItemDrawerTypes } from '../../../../components/drawer/ItemDrawer';
// Hooks
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import useTitle from '../../../../hooks/useTitle';
import useTrainingDatasetView from '../hooks/useTrainingDatasetView';
// Components
import Panel from '../../../../components/panel/Panel';
import Loader from '../../../../components/loader/Loader';
import StatisticsContent from '../../feature-group/data/StatisticsContent';
// Utils
import titles from '../../../../sources/titles';
import { TrainingDatasetStatistics as TdStatisticsType } from '../../../../store/models/training-dataset/statistics/trainingDatasetStatistics.model';

const TrainingDatasetStatistics: FC = () => {
  const { id, fsId, tdId, featureName, commitTime, split } = useParams();

  const statisticsState = useSelector(
    (state: RootState) => state.trainingDatasetStatistics,
  );

  const isStatisticsLoading = useSelector(
    (state: RootState) => state.loading.effects.trainingDatasetStatistics.fetch,
  );

  const commits = useSelector(
    (state: RootState) => state.trainingDatasetStatisticsCommits,
  );

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
    if (commits.length > 0) {
      if (!time || time === commits[0]) {
        time = `${format(+commits[0], dateFormat)} (latest)`;
      } else if (Number.isInteger(+time)) {
        time = format(+time, dateFormat);
      }
    }
    return time;
  }, [commitTime, commits]);

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

  const { data, isLoading } = useTrainingDatasetView(+id, +tdId);

  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigateRelative();

  const handleRefreshData = useCallback(() => {
    dispatch.trainingDatasets.fetch({
      projectId: +id,
      featureStoreId: +fsId,
    });
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
  }, [id, tdId, dispatch, fsId, commitTime]);

  const navigateToStatistics = useCallback(
    (timeString, splitName, id = +tdId) => {
      let normalizedTime = timeString;

      if (timeString.includes('(latest)')) {
        normalizedTime = timeString.slice(0, timeString.indexOf(' (latest)'));
      }

      const time = commits.find(
        (c) => format(+c, dateFormat) === normalizedTime,
      );

      let targetUri = `/${id}/statistics`;
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
        if (featureName) {
          targetUri = `${targetUri}/f/${featureName}`;
        }

        navigate(targetUri, 'p/:id/fs/:fsId/td/*');
      }
    },
    [featureName, commits, navigate, tdId],
  );

  const handleCommitChange = useCallback(
    (values) => {
      const [timeString] = values;

      navigateToStatistics(timeString, split);
    },
    [navigateToStatistics, split],
  );

  const handleSplitChange = useCallback(
    (values) => {
      const [splitName] = values;

      navigateToStatistics(commit, splitName);
    },
    [navigateToStatistics, commit],
  );

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

      navigateToStatistics(commit, split, newId);
    },
    [data, commit, split, navigateToStatistics],
  );

  useTitle(`${titles.statistics}${data?.name ? ` - ${data.name}` : ''}`);

  if (isLoading || isStatisticsLoading) {
    return <Loader />;
  }

  if (!data?.features.length) {
    return (
      <NoData mainText="No Features" secondaryText="">
        <Button
          intent="secondary"
          onClick={() =>
            navigate(
              routeNames.trainingDataset.list.replace(':fsId', fsId),
              routeNames.project.view,
            )
          }
        >
          Training Datasets
        </Button>
      </NoData>
    );
  }

  if (!statistics) {
    return (
      <NoData mainText="No Feature Statistics" secondaryText="">
        <Button
          intent="secondary"
          onClick={() =>
            navigate(
              routeNames.trainingDataset.list.replace(':fsId', fsId),
              routeNames.project.view,
            )
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
        hasCommitDropdown={true}
        hasVersionDropdown={true}
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
      {isStatisticsLoading ? (
        <Loader />
      ) : (
        <StatisticsContent
          data={data}
          type={ItemDrawerTypes.td}
          statistics={statistics}
          view={featureName}
        />
      )}
    </>
  );
};

export default TrainingDatasetStatistics;
