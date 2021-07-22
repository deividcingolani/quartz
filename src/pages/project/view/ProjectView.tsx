// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo, useCallback } from 'react';
// Hooks
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useTitle from '../../../hooks/useTitle';
import useProject from '../settings/useProject';
import useNavigateRelative from '../../../hooks/useNavigateRelative';
// Components
import Loader from '../../../components/loader/Loader';
import OverviewContent from './OverviewContent';
// Types
import { Dispatch, RootState } from '../../../store';

const ProjectView: FC = () => {
  const { id: projectId } = useParams();

  const navigate = useNavigateRelative();
  const dispatch = useDispatch<Dispatch>();

  const { project, isLoading } = useProject(+projectId);

  const currentUser = useSelector((state: RootState) => state.profile);

  useTitle(project.projectName);

  const handleUpdateDescription = useCallback(
    async ({ description }: { description: string }) => {
      await dispatch.project.edit({
        data: {
          retentionPeriod: '',
          services: [],
          description,
        },
        id: +projectId,
      });
      await dispatch.project.getProject(+projectId);
      navigate(`/p/${projectId}/view`);
    },
    [dispatch.project, projectId, navigate],
  );

  if (isLoading || !project) {
    return <Loader />;
  }

  return (
    <OverviewContent
      data={project}
      currentUser={currentUser}
      onUpdateDescription={handleUpdateDescription}
      onClickEdit={() => navigate(`/p/${projectId}/settings`)}
    />
  );
};

export default memo(ProjectView);
