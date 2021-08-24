// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

// Components
import Loader from '../../../../components/loader/Loader';
// Hooks
import useTitle from '../../../../hooks/useTitle';
// Utils
import titles from '../../../../sources/titles';
// Types
import { Dispatch, RootState } from '../../../../store';
// Selectors
import {
  selectEnvironment,
  selectJupyterLoading,
  selectSettings,
} from '../../../../store/models/jupyter/jupyter.selectors';
// Layouts
import ServerCard from './ServerCard';
// import RecentlyOpenCard from './RecentlyOpenCard';

const JupyterOverview: FC = () => {
  useTitle(titles.jupyter);

  const { id: projectId } = useParams();
  const { id: userId } = useSelector((state: RootState) => state.profile);

  const dispatch = useDispatch<Dispatch>();

  const { data: env } = useSelector(selectEnvironment);
  const { data: settings } = useSelector(selectSettings);
  const isLoading = useSelector(selectJupyterLoading);

  const loading = isLoading || env === null;

  useEffect(() => {
    dispatch.jupyter.fetch({ userId: +userId, projectId: +projectId });
    return () => {
      dispatch.jupyter.clear();
    };
  }, [dispatch.jupyter, projectId, userId]);

  if (loading || (env?.isReady && !settings)) {
    return <Loader />;
  }

  return (
    <>
      <ServerCard />
      {/* <RecentlyOpenCard /> */}
    </>
  );
};

export default memo(JupyterOverview);
