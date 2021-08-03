// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo, useMemo } from 'react';
import { Box } from 'rebass';
// Components
import ProjectMembers from './ProjectMembers';
import DangerZone from './DangerZone';
import SharedWith from './multistore/SharedWith';
import SharedFrom from './multistore/SharedFrom';
// Types
import { Project } from '../../../types/project';
import { SharedProject } from '../../../types/multistore';
import { User } from '../../../types/user';
import { SharedDataset } from '../../../store/models/projects/multistore.model';

export interface ContentProps {
  user: User;
  project: Project;
  datasets: SharedDataset[];
  sharedProjects: SharedProject[];
}

export enum Roles {
  'Data scientist' = 'Data scientist',
  'Data owner' = 'Data owner',
}

const SettingsContent: FC<ContentProps> = ({
  user,
  project,
  datasets,
  sharedProjects,
}) => {
  const userIsLimited = useMemo(() => {
    const userInProject = project.projectTeam.find(
      (teamMember) => teamMember.user.email === user.email,
    );
    return userInProject?.teamRole === Roles['Data scientist'];
  }, [project, user]);

  return (
    <>
      {!!project.projectTeam && <ProjectMembers project={project} />}
      <SharedWith
        project={project}
        shared={sharedProjects}
        userIsLimited={userIsLimited}
      />
      <SharedFrom
        project={project}
        datasets={datasets}
        userIsLimited={userIsLimited}
      />
      <DangerZone project={project} />
      <Box
        sx={{
          height: '20px',
          width: '100%',
          backgroundColor: '#F5F5F5',
          opacity: 0,
        }}
      >
        invisible block margin
      </Box>
    </>
  );
};

export default memo(SettingsContent);
