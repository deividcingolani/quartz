import React, { FC, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@logicalclocks/quartz';
import { useParams } from 'react-router-dom';
import NoData from '../../../../components/no-data/NoData';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import routeNames from '../../../../routes/routeNames';

// Types
import { Dispatch, RootState } from '../../../../store';
// Hooks
import useFeatureGroupView from '../hooks/useFeatureGroupView';

// Components
import StatisticsContent from './StatisticsContent';
import Panel from '../../../../components/panel/Panel';
import Loader from '../../../../components/loader/Loader';
// Selectors
import { selectFeatureStoreData } from '../../../../store/models/feature/selectors';

const FeatureGroupStatistics: FC = () => {
  const { id, fgId, featureName } = useParams();

  const { data: featureStoreData } = useSelector(selectFeatureStoreData);

  const statistics = useSelector(
    (state: RootState) => state.featureGroupStatistics?.entities.statistics,
  );

  const isStatisticsLoading = useSelector(
    (state: RootState) => state.loading.effects.featureGroupStatistics.fetch,
  );

  const { data, isLoading } = useFeatureGroupView(+id, +fgId);

  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigateRelative();

  const handleRefreshData = useCallback(() => {
    if (featureStoreData?.featurestoreId) {
      dispatch.featureGroupStatistics.fetch({
        projectId: +id,
        featureStoreId: featureStoreData.featurestoreId,
        featureGroupId: +fgId,
      });
    }
  }, [id, fgId, dispatch]);

  useEffect(() => {
    if (featureStoreData?.featurestoreId) {
      dispatch.featureGroupStatistics.fetch({
        projectId: +id,
        featureStoreId:  featureStoreData.featurestoreId,
        featureGroupId: +fgId,
      });
    }

    return () => {
      dispatch.featureGroupStatistics.clear();
      dispatch.featureGroupRows.clear();
    };
  }, [id, fgId, dispatch]);

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
        title={data.name}
        id={data.id}
        onClickEdit={() => ({})}
        onClickRefresh={handleRefreshData}
      />
      {isStatisticsLoading ? (
        <Loader />
      ) : (
        <StatisticsContent
          featureGroupData={data}
          statistics={statistics}
          view={featureName}
        />
      )}
    </>
  );
};

export default FeatureGroupStatistics;
