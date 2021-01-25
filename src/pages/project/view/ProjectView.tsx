import React, { FC, memo, useEffect } from 'react';
import useNavigateRelative from '../../../hooks/useNavigateRelative';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

// Components
import Loader from '../../../components/loader/Loader';
// Types
import { Dispatch, RootState } from '../../../store';
// Components
import OverviewContent from './OverviewContent';
import useTitle from '../../../hooks/useTitle';

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

  useTitle(project.projectName);

  if (isLoading || !project) {
    return <Loader />;
  }

  return (
    <OverviewContent
      data={project}
      onClickEdit={() => navigate(`/p/${projectId}/edit`)}
    />
  );
};

export default memo(ProjectView);
