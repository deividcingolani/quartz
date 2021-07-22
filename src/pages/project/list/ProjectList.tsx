// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo, useCallback, useEffect, useMemo } from 'react';
import { Flex } from 'rebass';
import { Button, Value } from '@logicalclocks/quartz';
import { useDispatch, useSelector } from 'react-redux';

// Types
import { Dispatch, RootState } from '../../../store';
// Hooks
import useNavigateRelative from '../../../hooks/useNavigateRelative';

import routeNames from '../../../routes/routeNames';
// Components
import Loader from '../../../components/loader/Loader';
import ProjectListContent from './ProjectListContent';
import NoProjects from '../../../components/no-projects/NoProjects';
import useTitle from '../../../hooks/useTitle';
import titles from '../../../sources/titles';
import LastPathService from '../../../services/localStorage/LastPathService';

const ProjectList: FC = () => {
  useTitle(titles.projectList);

  const projects = useSelector((state: RootState) => state.projectsList).sort(
    (p1, p2) => p1.name.localeCompare(p2.name),
  );

  const isGetProjects = useSelector(
    (state: RootState) => state.loading.effects.projectsList.getProjects,
  );

  const isDeleting = useSelector(
    (state: RootState) => state.loading.effects.project.delete,
  );

  const { id: userId } = useSelector((state: RootState) => state.profile);

  const isLoading = useMemo(
    () => isGetProjects || isDeleting,
    [isGetProjects, isDeleting],
  );

  const navigate = useNavigateRelative();
  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    dispatch.projectsList.getProjects();
    const lastProject = LastPathService.getInfo(userId);

    if (lastProject) navigate(`/p/${lastProject}/view`);
  }, [dispatch, navigate, userId]);

  // Handlers
  const handleCreate = useCallback(() => {
    navigate(routeNames.project.create);
  }, [navigate]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Flex mb="20px" flexGrow={1} flexDirection="column">
      {!isLoading && projects.length > 0 && (
        <>
          <Flex justifyContent="space-between" mt="20px" mb="20px">
            <Flex>
              <Value primary px="5px">
                {projects.length}
              </Value>
              <Value px="5px">projects</Value>
            </Flex>
            <Button onClick={handleCreate}>Create new project</Button>
          </Flex>
          <ProjectListContent data={projects} />
        </>
      )}
      {!isLoading && !projects.length && <NoProjects />}
    </Flex>
  );
};

export default memo(ProjectList);
