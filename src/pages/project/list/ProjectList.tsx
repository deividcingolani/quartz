// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo, useCallback, useEffect, useMemo } from 'react';
import { Flex } from 'rebass';
import { Button, Value } from '@logicalclocks/quartz';
import { useDispatch, useSelector } from 'react-redux';
// Types
import { useNavigate } from 'react-router-dom';
import { Dispatch, RootState } from '../../../store';
import useSortedProjects from './hooks/useSortedProjects';
// Utils
import routeNames from '../../../routes/routeNames';
// Components

import Loader from '../../../components/loader/Loader';
import ProjectListContent from './ProjectListContent';
import NoProjects from '../../../components/no-projects/NoProjects';
import useTitle from '../../../hooks/useTitle';
import titles from '../../../sources/titles';
import LastPathService from '../../../services/localStorage/LastPathService';
import getHrefNoMatching from '../../../utils/getHrefNoMatching';

const ProjectList: FC = () => {
  useTitle(titles.projectList);

  const projects = useSortedProjects();

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

  const navigate = useNavigate();
  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    dispatch.projectsList.getProjects();
    const lastProject = LastPathService.getInfo(userId);

    if (lastProject)
      navigate(
        getHrefNoMatching(routeNames.project.viewHome, '', true, {
          id: lastProject,
        }),
      );
  }, [dispatch, navigate, userId]);

  // Handlers
  const handleCreate = useCallback(() => {
    navigate(getHrefNoMatching(routeNames.project.create, '', true));
  }, [navigate]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Flex mb="20px" flexGrow={1} flexDirection="column">
      {!isLoading && projects.length > 0 && (
        <>
          <Flex justifyContent="space-between" mt="20px" mb="20px">
            <Flex alignItems="center">
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
