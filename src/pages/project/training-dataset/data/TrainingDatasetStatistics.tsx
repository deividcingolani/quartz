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
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
// Components
import Panel from '../../../../components/panel/Panel';
import Loader from '../../../../components/loader/Loader';
// Selectors
import { selectFeatureStoreData } from '../../../../store/models/feature/selectors';
import useTrainingDatasetView from '../hooks/useTrainingDatasetView';
import StatisticsContent from '../../feature-group/data/StatisticsContent';
import { ItemDrawerTypes } from '../../../../components/drawer/ItemDrawer';
import useTitle from '../../../../hooks/useTitle';
import titles from '../../../../sources/titles';

const TrainingDatasetStatistics: FC = () => {
  const { id, tdId, featureName, commitTime } = useParams();

  const { data: featureStoreData } = useSelector(selectFeatureStoreData);

  const statistics = useSelector(
    (state: RootState) => state.trainingDatasetStatistics?.entities.statistics,
  );

  const commits = useSelector(
    (state: RootState) => state.trainingDatasetStatisticsCommits,
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
    (state: RootState) => state.loading.effects.trainingDatasetStatistics.fetch,
  );

  const { data, isLoading } = useTrainingDatasetView(+id, +tdId);

  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigateRelative();

  const handleRefreshData = useCallback(() => {
    if (featureStoreData?.featurestoreId) {
      dispatch.trainingDatasets.fetch({
        projectId: +id,
        featureStoreId: featureStoreData.featurestoreId,
      });
      dispatch.trainingDatasetStatisticsCommits.fetch({
        projectId: +id,
        featureStoreId: featureStoreData.featurestoreId,
        trainingDatasetId: +tdId,
      });
      dispatch.trainingDatasetStatistics.fetch({
        projectId: +id,
        featureStoreId: featureStoreData.featurestoreId,
        trainingDatasetId: +tdId,
        timeCommit: commitTime,
      });
    }
  }, [id, tdId, dispatch, featureStoreData, commitTime]);

  const navigateToStatistics = useCallback(
    (timeString, id = +tdId) => {
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
            'p/:id/td/*',
          );
        } else {
          navigate(`/${id}/statistics/commit/${time}`, 'p/:id/td/*');
        }
      } else if (id !== tdId) {
        navigate(`/${id}/statistics`, 'p/:id/td/*');
      }
    },
    [featureName, commits, navigate, tdId, commit],
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
      dispatch.trainingDatasetStatisticsCommits.fetch({
        projectId: +id,
        featureStoreId: featureStoreData.featurestoreId,
        trainingDatasetId: +tdId,
      });
      dispatch.trainingDatasetStatistics.fetch({
        projectId: +id,
        featureStoreId: featureStoreData.featurestoreId,
        trainingDatasetId: +tdId,
        timeCommit: commitTime,
      });
    }

    return () => {
      dispatch.trainingDatasetStatistics.clear();
    };
  }, [id, tdId, dispatch, featureStoreData, commitTime]);

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

      navigateToStatistics(commit, newId);
    },
    [data, commit, navigateToStatistics],
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
          onClick={() => navigate(routeNames.trainingDataset.list, 'p/:id/*')}
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
          onClick={() => navigate(routeNames.trainingDataset.list, 'p/:id/*')}
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
          type={ItemDrawerTypes.td}
          statistics={statistics}
          view={featureName}
        />
      )}
    </>
  );
};

export default TrainingDatasetStatistics;
