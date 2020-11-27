import React, { FC, memo, useCallback, useEffect } from 'react';
import useNavigateRelative from '../../../hooks/useNavigateRelative';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

// Components
import Loader from '../../../components/loader/Loader';
// Types
import { Dispatch, RootState } from '../../../store';
// Components
import OverviewContent from './OverviewContent';

import routeNames from '../../../routes/routeNames';

const ProjectView: FC = () => {
  const { id: projectId } = useParams();

  const navigate = useNavigateRelative();

  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    dispatch.project.getProject(+projectId);
  }, [projectId, dispatch]);

  const project = useSelector((state: RootState) => state.project);

  const isLoading = useSelector(
    (state: RootState) => state.loading.effects.project.getProject,
  );

  const handleNavigate = useCallback(
    (id: number, route: string) => (): void => {
      navigate(route.replace(':id', id.toString()));
    },
    [navigate],
  );

  if (isLoading || !project) {
    return <Loader />;
  }

  return (
    <OverviewContent
      data={project}
      onClickEdit={handleNavigate(project.id, routeNames.project.edit)}
    />
  );
};

export default memo(ProjectView);
