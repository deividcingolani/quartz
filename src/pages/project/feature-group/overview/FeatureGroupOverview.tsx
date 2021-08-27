// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo, useCallback, useEffect } from 'react';
import { Subtitle } from '@logicalclocks/quartz';
import { useNavigate, useParams } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import routeNames from '../../../../routes/routeNames';
import useFeatureGroupView from '../hooks/useFeatureGroupView';

import OverviewContent from './OverviewContent';
// Components
import Loader from '../../../../components/loader/Loader';
// Types
import { FeatureGroup } from '../../../../types/feature-group';
import useTitle from '../../../../hooks/useTitle';
import { Dispatch } from '../../../../store';
import useProvenance from '../../../../hooks/useProvenance';
import getHrefNoMatching from '../../../../utils/getHrefNoMatching';

const FeatureGroupOverview: FC = () => {
  const { id: projectId, fsId, fgId } = useParams();

  const {
    data: fgData,
    isLoading: isFGLoading,
    fetchData,
  } = useFeatureGroupView(+projectId, +fgId, +fsId);

  const { provenance } = useProvenance({
    projectId: +projectId,
    featureStoreId: +fsId,
    data: fgData,
  });

  const navigate = useNavigate();

  const dispatch = useDispatch<Dispatch>();

  const handleNavigate = useCallback(
    (id: number, route: string) => (): void => {
      navigate(
        getHrefNoMatching(route, routeNames.project.value, true, {
          fgId: id,
          fsId,
          id: projectId,
        }),
      );
    },
    [fsId, projectId, navigate],
  );

  useEffect(() => {
    return () => {
      dispatch.featureGroupView.clear();
      dispatch.provenance.clear();
    };
  }, [dispatch]);

  useTitle(fgData?.name);

  if (isFGLoading) {
    return <Loader />;
  }

  if (!fgData) {
    return <Subtitle>No data</Subtitle>;
  }

  return (
    <OverviewContent
      data={{ ...fgData, provenance } as FeatureGroup}
      onClickEdit={handleNavigate(+fgId, routeNames.featureGroup.edit)}
      onClickRefresh={fetchData}
    />
  );
};

export default memo(FeatureGroupOverview);
