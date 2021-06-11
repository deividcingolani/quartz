import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Dispatch, RootState } from '../../../store';

const useProject = (projectId: number) => {
  const isLoading = useSelector(
    (state: RootState) => state.loading.effects.project.getProject,
  );

  const project = useSelector((state: RootState) => state.project);

  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    if (
      projectId &&
      !isLoading &&
      (!Object.keys(project) || projectId !== project.projectId)
    ) {
      dispatch.project.getProject(projectId);
      dispatch.members.fetch();
    }
  }, [project, projectId, dispatch, isLoading]);

  return { project, isLoading };
};

export default useProject;
