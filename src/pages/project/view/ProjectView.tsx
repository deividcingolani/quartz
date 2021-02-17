import React, { FC, memo } from 'react';
import { useParams } from 'react-router-dom';
import useNavigateRelative from '../../../hooks/useNavigateRelative';

// Components
import Loader from '../../../components/loader/Loader';
import OverviewContent from './OverviewContent';
// Hooks
import useTitle from '../../../hooks/useTitle';
import useProject from './useProject';

const ProjectView: FC = () => {
  const { id: projectId } = useParams();

  const navigate = useNavigateRelative();

  const { project, isLoading } = useProject(+projectId);

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
