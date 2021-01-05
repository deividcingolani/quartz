import { Flex } from 'rebass';
import React, { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Drawer, Value } from '@logicalclocks/quartz';
import { useDispatch, useSelector } from 'react-redux';

// Components
import Loader from '../loader/Loader';
import StatisticsRows from '../../pages/project/feature-group/data/StatisticsRows';
import StatisticsCharts from '../../pages/project/feature-group/data/StatisticsCharts';
import StatisticsTables from '../../pages/project/feature-group/data/StatisticsTables';
// Types
import { Feature } from '../../types/feature-group';
import { Dispatch, RootState } from '../../store';
import { ItemDrawerTypes } from '../drawer/ItemDrawer';

export interface FeatureDrawerProps {
  isOpen: boolean;
  handleToggle: () => void;
  feature: Feature;
}

const FeatureDrawer: FC<FeatureDrawerProps> = ({
  isOpen,
  handleToggle,
  feature,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<Dispatch>();

  const fgPageUrl = `/p/${feature.parentProjectId}/fg/${feature.id}`;
  const dataPreviewUrl = `/p/${feature.parentProjectId}/fg/${feature.id}/data-preview/${feature.name}`;

  useEffect(() => {
    dispatch.featureGroupStatistics.fetch({
      projectId: feature.parentProjectId,
      featureStoreId: feature.featurestoreId,
      featureGroupId: +feature.id,
    });
  }, [feature, dispatch]);

  const statistics = useSelector(
    (state: RootState) => state.featureGroupStatistics?.entities.statistics,
  );

  const isLoading = useSelector(
    (state: RootState) => state.loading.effects.featureGroupStatistics.fetch,
  );

  if (isLoading) {
    return (
      <Drawer
        mt="10px"
        bottom="20px"
        closeOnBackdropClick={false}
        isOpen={isOpen}
        bottomButton={[
          `Open in Feature Groups Page ->`,
          () => navigate(fgPageUrl),
        ]}
        onClose={handleToggle}
      >
        <Loader />
      </Drawer>
    );
  }

  if (!statistics || !statistics[feature.name]) {
    return (
      <Drawer
        mt="10px"
        bottom="20px"
        isOpen={isOpen}
        bottomButton={[
          `Open in Feature Groups Page ->`,
          () => navigate(fgPageUrl),
        ]}
        onClose={handleToggle}
      >
        <Value textAlign="center" mt="30px">
          No Feature Statistics
        </Value>
      </Drawer>
    );
  }

  const data = statistics[feature.name];

  return (
    <Drawer
      mt="10px"
      bottom="20px"
      isOpen={isOpen}
      bottomButton={[
        `Open in Feature Groups Page ->`,
        () => navigate(fgPageUrl),
      ]}
      onClose={handleToggle}
    >
      <Drawer.Section title="Data overview">
        <Flex width="100%" ml="-20%">
          {data.histogram && (
            <StatisticsCharts
              dataType={ItemDrawerTypes.fg}
              data={data.histogram}
              type={data.dataType}
            />
          )}
          {!data.histogram && (
            <Value textAlign="center" mt="30px">
              No Feature Histogram
            </Value>
          )}
        </Flex>
      </Drawer.Section>

      <Drawer.Section
        title="Data preview"
        action={['view data preview table -->', () => navigate(dataPreviewUrl)]}
      >
        <StatisticsRows isDrawer={true} featureName={feature.name} />
      </Drawer.Section>

      <Drawer.Section title="Statistics">
        <StatisticsTables isDrawer={true} data={data} />
      </Drawer.Section>
    </Drawer>
  );
};

export default FeatureDrawer;
