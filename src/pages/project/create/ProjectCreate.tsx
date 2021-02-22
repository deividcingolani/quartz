import { Box, Flex } from 'rebass';
import { useDispatch, useSelector } from 'react-redux';
import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { Button, Callout, CalloutTypes, Value } from '@logicalclocks/quartz';
// Types
import { Roles } from '../forms/AddMembers';
import { ProjectFormData } from '../forms/types';
import { Dispatch, RootState } from '../../../store';
// Hooks
import useTitle from '../../../hooks/useTitle';
import useNavigateRelative from '../../../hooks/useNavigateRelative';
// Components
import ProjectForm from '../forms/ProjectForm';

import { selectIsAddingMember } from '../../../store/models/projects/selectors';

import titles from '../../../sources/titles';

const ProjectCreate: FC = () => {
  useTitle(titles.createProject);

  const isSubmit = useSelector(
    (state: RootState) => state.loading.effects.project.create,
  );

  const isAddingMembers = useSelector(selectIsAddingMember);

  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigateRelative();

  const projects = useSelector((state: RootState) => state.projectsList);

  const isProjectsLoading = useSelector(
    (state: RootState) => state.loading.effects.projectsList.getProjects,
  );

  const isDemoExists = useMemo(
    () => !!projects.find((p) => p.name.includes('demo_')),
    [projects],
  );

  useEffect(() => {
    dispatch.members.fetch();
    dispatch.projectsList.getProjects();
    return () => {
      dispatch.projectsList.clear();
    };
  }, [dispatch]);

  const getProjectId = useCallback(
    async (name: string) => {
      const newProjects = await dispatch.projectsList.getProjects();
      return newProjects.find((p) => p.name === name)?.id;
    },
    [dispatch],
  );

  // Handlers
  const handleSubmit = useCallback(
    async (data: ProjectFormData) => {
      await dispatch.project.create({
        data: {
          retentionPeriod: '',
          services: ['JOBS', 'JUPYTER', 'HIVE', 'KAFKA', 'FEATURESTORE'],
          type: '',
          ...data,
        },
      });

      const id = await getProjectId(data.projectName);

      if (id) {
        const selectedMembers = data.membersEmails.map((email) => ({
          projectTeamPK: {
            projectId: id,
            teamMember: email,
          },
          teamRole: Roles['Data scientist'],
        }));

        await dispatch.members.add({
          id: +id,
          data: {
            projectTeam: selectedMembers,
          },
        });

        navigate(`/p/${id}/view`);
      } else {
        navigate(`/`);
      }
    },
    [dispatch, navigate, getProjectId],
  );

  const handleSubmitDemo = useCallback(async () => {
    const project = await dispatch.project.create({
      data: {
        retentionPeriod: '',
        services: [],
        type: 'fs',
        projectName: 'demo_starterProject',
        description: 'demo project',
      },
    });

    if (project) {
      navigate(`/p/${project.id}/view`);
    }
  }, [dispatch, navigate]);

  return (
    <>
      {!isDemoExists && !isProjectsLoading && (
        <Box mb="40px" sx={{ position: 'relative' }}>
          <Callout
            type={CalloutTypes.valid}
            content={
              <Flex height="30px" alignItems="center">
                <Value primary fontFamily="Inter">
                  For an overview of Hopsworks, run a demo project
                </Value>
                <Button
                  onClick={handleSubmitDemo}
                  sx={{ position: 'absolute', right: '10px' }}
                  intent="secondary"
                >
                  Run a demo project
                </Button>
              </Flex>
            }
          />
        </Box>
      )}
      <ProjectForm
        isLoading={isSubmit || isProjectsLoading || isAddingMembers}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default ProjectCreate;
