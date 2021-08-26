// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback, useMemo } from 'react';
import { Button, Microlabeling, User } from '@logicalclocks/quartz';
import { Flex } from 'rebass';

// Hooks
import { useNavigate } from 'react-router-dom';
// Types
import { Project, TeamMember } from '../../../types/project';
import getHrefNoMatching from '../../../utils/getHrefNoMatching';
import routeNames from '../../../routes/routeNames';

export interface StorageConnectorListContentProps {
  data: Project;
}

enum UserTypes {
  'Data owner' = 'Data owner',
  'Data scientist' = 'Data scientist',
}
interface ProjectTeam {
  'Data owner': TeamMember[];
  'Data scientist': TeamMember[];
}

const ProjectMembers: FC<StorageConnectorListContentProps> = ({ data }) => {
  const navigate = useNavigate();

  const projectTeam = useMemo(() => {
    return data.projectTeam.reduce((acc, user) => {
      const role = user.teamRole as UserTypes;
      acc[role] = [...(acc?.[role] || []), user];
      return acc;
    }, {} as ProjectTeam);
  }, [data]);

  const handleNavigate = useCallback(() => {
    navigate(
      getHrefNoMatching(
        routeNames.project.settings.settings,
        routeNames.project.value,
        true,
        { id: data.projectId },
      ),
    ); // `/p/${data.projectId}/settings`
  }, [data, navigate]);

  return (
    <Flex mt="25px" alignItems="center">
      {projectTeam['Data owner'] && (
        <Flex flexDirection="column">
          <Microlabeling mb="3px" gray>
            Data owners
          </Microlabeling>
          <Flex flexDirection="row">
            {projectTeam['Data owner']?.map(({ user }) => (
              <Flex key={user.email} mr="5px">
                <User firstName={user.fname} lastName={user.lname} />
              </Flex>
            ))}
          </Flex>
        </Flex>
      )}
      {projectTeam['Data scientist'] && (
        <Flex flexDirection="column" ml="30px">
          <Microlabeling mb="3px" gray>
            Data scientists
          </Microlabeling>
          <Flex flexDirection="row">
            {projectTeam['Data scientist']?.map(({ user }) => (
              <Flex key={user.email} mr="5px">
                <User firstName={user.fname} lastName={user.lname} />
              </Flex>
            ))}
          </Flex>
        </Flex>
      )}
      <Button
        ml="20px"
        variant="inline"
        p="0"
        mt="15px"
        onClick={handleNavigate}
      >
        edit members
      </Button>
    </Flex>
  );
};

export default ProjectMembers;
