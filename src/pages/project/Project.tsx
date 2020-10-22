import { useDispatch, useSelector } from 'react-redux';
import React, { FC, useCallback, useEffect } from 'react';
import { Route, Routes, useParams } from 'react-router-dom';

import routeNames from '../../routes/routeNames';
// Components
import Loader from '../../components/loader/Loader';
import Suspense from '../../components/suspense/Suspense';
// Selectors
import { selectFeatureStoreData } from '../../store/models/feature/selectors';
// Types
import { Dispatch } from '../../store';

// Feature Group
const FeatureGroupList = React.lazy(
  () => import('./feature-group/list/FeatureGroupList'),
);
const FeatureGroupEdit = React.lazy(
  () => import('./feature-group/FeatureGroupEdit'),
);

const Project: FC = () => {
  const { id } = useParams();
  const { data: featureStoreData, isLoading: isFSLoading } = useSelector(
    selectFeatureStoreData,
  );

  const dispatch = useDispatch<Dispatch>();

  const clearData = useCallback((): void => {
    dispatch.featureGroups.setFeatureGroups([]);
    dispatch.featureStores.setFeatureStores(null);
  }, [dispatch]);

  useEffect(() => {
    clearData();

    dispatch.featureStores.fetch({ projectId: +id });
  }, [dispatch, id, clearData]);

  if (!featureStoreData && isFSLoading) {
    return <Loader />;
  }

  return (
    <Routes>
      <Route path={routeNames.featureGroupEdit}>
        <Suspense>
          <FeatureGroupEdit />
        </Suspense>
      </Route>
      <Route path={routeNames.featureGroupList}>
        <Suspense>
          <FeatureGroupList projectId={+id} />
        </Suspense>
      </Route>
    </Routes>
  );
};

export default Project;
