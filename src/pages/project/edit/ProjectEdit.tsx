import React, { FC, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// Types
import { Dispatch, RootState } from '../../../store';
import { ProjectFormData } from '../forms/types';
import { Project } from '../../../types/project';
// Hooks
import useNavigateRelative from '../../../hooks/useNavigateRelative';
// Components
import ProjectForm from '../forms/ProjectForm';
import Loader from '../../../components/loader/Loader';

const ProjectEdit: FC = () => {
  const { id: projectId } = useParams();

  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigateRelative();

  useEffect(() => {
    dispatch.project.getProject(+projectId);

    return () => {
      dispatch.project.setProject({} as Project);
    };
  }, [projectId, dispatch]);

  const isSubmit = useSelector(
    (state: RootState) => state.loading.effects.project.edit,
  );

  const project = useSelector((state: RootState) => state.project);

  const isLoading = useSelector(
    (state: RootState) => state.loading.effects.project.getProject,
  );

  // Handlers
  const handleSubmit = useCallback(
    async (data: ProjectFormData) => {
      await dispatch.project.edit({
        data: {
          retentionPeriod: '',
          services: [],
          ...data,
        },
        id: +projectId,
      });

      navigate(`/p/${projectId}/view`);
    },
    [dispatch, navigate, projectId],
  );

  if (isLoading || !Object.keys(project).length) {
    return <Loader />;
  }

  return (
    <ProjectForm
      isLoading={isSubmit}
      isEdit={true}
      initialData={project}
      onSubmit={handleSubmit}
    />
  );
};

export default ProjectEdit;
