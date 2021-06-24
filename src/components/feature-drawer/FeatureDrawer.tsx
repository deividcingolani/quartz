// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useEffect } from 'react';
import { Flex } from 'rebass';
import { useNavigate } from 'react-router-dom';
import { Drawer, Labeling, Value } from '@logicalclocks/quartz';
import { useDispatch, useSelector } from 'react-redux';

// Components
import Loader from '../loader/Loader';
import StatisticsRows from '../../pages/project/feature-group/data/StatisticsRows';
import StatisticsCharts from '../../pages/project/feature-group/data/StatisticsCharts';
import StatisticsTables from '../../pages/project/feature-group/data/StatisticsTables';
// Types
import { Dispatch, RootState } from '../../store';
import { ItemDrawerTypes } from '../drawer/ItemDrawer';
import { Feature } from '../../types/feature';

export interface FeatureDrawerProps {
  isOpen: boolean;
  handleToggle: () => void;
  feature: Feature | any;
  fgId: number;
  projectId: number;
  featureStoreId: number;
}

const FeatureDrawer: FC<FeatureDrawerProps> = ({
  isOpen,
  handleToggle,
  feature,
  fgId,
  projectId,
  featureStoreId,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<Dispatch>();

  const fgPageUrl = `/p/${projectId}/fg/${fgId}`;
  const dataPreviewUrl = `/p/${projectId}/fg/${fgId}/data-preview/${feature.name}`;

  useEffect(() => {
    dispatch.featureGroupStatistics.fetch({
      projectId,
      featureStoreId,
      featureGroupId: fgId,
    });
  }, [feature, dispatch, fgId, projectId, featureStoreId]);

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
        <Flex width="100%">
          {data.histogram && data.dataType && (
            <Flex width="100%" justifyContent="center">
              <StatisticsCharts
                dataType={ItemDrawerTypes.fg}
                data={data.histogram}
                type={data.dataType}
              />
            </Flex>
          )}
          {(!data.histogram || !data.dataType) && (
            <Labeling bold gray textAlign="center">
              No data overview
            </Labeling>
          )}
        </Flex>
      </Drawer.Section>

      <Drawer.Section
        title="Data preview"
        action={['view data preview table -->', () => navigate(dataPreviewUrl)]}
      >
        <StatisticsRows
          projectId={projectId}
          featureStoreId={featureStoreId}
          fgId={fgId}
          isDrawer={true}
          featureName={feature.name}
        />
      </Drawer.Section>

      <Drawer.Section title="Statistics">
        <StatisticsTables isDrawer={true} data={data} />
      </Drawer.Section>
    </Drawer>
  );
};

export default FeatureDrawer;
