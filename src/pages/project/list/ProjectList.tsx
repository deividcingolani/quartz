import { Flex } from 'rebass';
import { useDispatch, useSelector } from 'react-redux';
import React, { FC, memo, useCallback, useEffect, useMemo } from 'react';
import { Button, Value } from '@logicalclocks/quartz';

// Types
import { Dispatch, RootState } from '../../../store';
// Hooks
import useNavigateRelative from '../../../hooks/useNavigateRelative';

import routeNames from '../../../routes/routeNames';
// Components
import Loader from '../../../components/loader/Loader';
import ProjectListContent from './ProjectListContent';
import NoData from '../../../components/no-data/NoData';

const ProjectList: FC = () => {
  const projects = useSelector((state: RootState) => state.projectsList);

  const isGetProjects = useSelector(
    (state: RootState) => state.loading.effects.projectsList.getProjects,
  );

  const isDeleting = useSelector(
    (state: RootState) => state.loading.effects.project.delete,
  );

  const isLoading = useMemo(() => isGetProjects || isDeleting, [
    isGetProjects,
    isDeleting,
  ]);

  const navigate = useNavigateRelative();
  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    dispatch.projectsList.getProjects();
  }, [dispatch]);

  // Handlers
  const handleRouteChange = useCallback(
    (url: string) => () => {
      navigate(url, routeNames.project.view);
    },
    [navigate],
  );

  const handleCreate = useCallback(() => {
    navigate(routeNames.project.create);
  }, [navigate]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Flex flexGrow={1} flexDirection="column">
      <Flex justifyContent="space-between" mt="20px" mb="20px">
        <Flex>
          <Value primary px="5px">
            {projects.length}
          </Value>
          <Value px="5px">active projects</Value>
        </Flex>
        <Button onClick={handleCreate}>Create new project</Button>
      </Flex>
      {!isLoading && <ProjectListContent data={projects} />}
      {!isLoading && !projects.length && (
        <NoData mainText="No Projects" secondaryText="">
          <Button
            intent="secondary"
            onClick={handleRouteChange(routeNames.source.list)}
            mr="14px"
          >
            All Sources
          </Button>
          <Button intent="secondary" onClick={handleRouteChange('')} mr="14px">
            Feature Group Documentation
          </Button>
          <Button onClick={handleCreate}>New Feature Group</Button>
        </NoData>
      )}
    </Flex>
  );
};

export default memo(ProjectList);
