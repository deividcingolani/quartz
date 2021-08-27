// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// Types
import { Dispatch, RootState } from '../../../store';
import { ProjectFormData } from '../forms/types';
// Components
import ProjectForm from '../forms/ProjectForm';
import Loader from '../../../components/loader/Loader';
import useTitle from '../../../hooks/useTitle';
import titles from '../../../sources/titles';
import getHrefNoMatching from '../../../utils/getHrefNoMatching';
import routeNames from '../../../routes/routeNames';

const ProjectEdit: FC = () => {
  const { id: projectId } = useParams();

  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch.project.getProject(+projectId);

    return () => {
      dispatch.project.getProject(+projectId);
    };
  }, [dispatch, projectId]);

  const isSubmit = useSelector(
    (state: RootState) => state.loading.effects.project.edit,
  );

  const project = useSelector((state: RootState) => state.project);

  useTitle(`${titles.editProject} ${project.projectName || ''}`);

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

      navigate(
        getHrefNoMatching(routeNames.project.viewHome, '', true, {
          id: projectId,
        }),
      );
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
