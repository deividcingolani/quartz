import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch, RootState } from '../../../store';
import useProject from './useProject';

const useSharedWith = (projectId: number) => {
  const dispatch = useDispatch<Dispatch>();
  const { project, isLoading: isProjectLoading } = useProject(+projectId);

  const isSharedLoading = useSelector(
    (state: RootState) => state.loading.effects.multistore.getSharedWith,
  );

  const data = useSelector((state: RootState) => state.multistore.with);

  const isLoading = isProjectLoading || isSharedLoading;

  useEffect(() => {
    if (!data && !isLoading && project.projectName) {
      dispatch.multistore.getSharedWith({
        id: projectId,
        name: project.projectName,
      });
    }
  }, [projectId, project.projectName, dispatch, isLoading, data]);

  return { data, isLoading };
};

export default useSharedWith;
