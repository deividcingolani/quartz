// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Select } from '@logicalclocks/quartz';
import routeNames from '../../../../routes/routeNames';
// Types
import { Dispatch, RootState } from '../../../../store';
// Hooks
import useTrainingDatasetView from '../hooks/useTrainingDatasetView';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
// Components
import Panel from '../../../../components/panel/Panel';
import Loader from '../../../../components/loader/Loader';
import NoData from '../../../../components/no-data/NoData';
import Correlation from '../../../../components/correlation/Correlation';
// Selectors
import { selectFeatureStoreData } from '../../../../store/models/feature/selectors';
import { ItemDrawerTypes } from '../../../../components/drawer/ItemDrawer';
import useTitle from '../../../../hooks/useTitle';
import titles from '../../../../sources/titles';
// Utils
import { useVersionsSort } from '../utils';

const TrainingDatasetCorrelation: FC = () => {
  const { id, tdId } = useParams();

  const { data: featureStoreData } = useSelector(selectFeatureStoreData);

  const statistics = useSelector(
    (state: RootState) => state.trainingDatasetStatistics?.entities.statistics,
  );

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
      dispatch.trainingDatasetStatistics.fetch({
        projectId: +id,
        featureStoreId: featureStoreData.featurestoreId,
        trainingDatasetId: +tdId,
      });
    }
  }, [id, tdId, dispatch, featureStoreData]);

  useEffect(() => {
    if (featureStoreData?.featurestoreId) {
      dispatch.trainingDatasets.fetch({
        projectId: +id,
        featureStoreId: featureStoreData.featurestoreId,
      });
      dispatch.trainingDatasetStatistics.fetch({
        projectId: +id,
        featureStoreId: featureStoreData.featurestoreId,
        trainingDatasetId: +tdId,
      });
    }

    return () => {
      dispatch.trainingDatasetStatistics.clear();
    };
  }, [id, tdId, dispatch, featureStoreData]);

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

      if (newId) {
        navigate(`/${newId}/correlation`, '/p/:id/td/*');
      }
    },
    [data, navigate],
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
          onClick={() => navigate(routeNames.trainingDataset.list, 'p/:id/*')}
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
        type={ItemDrawerTypes.td}
      />
    </>
  );
};

export default TrainingDatasetCorrelation;
