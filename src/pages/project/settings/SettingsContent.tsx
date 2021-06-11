import React, { FC, memo } from 'react';
// Types
import { Project } from '../../../types/project';
// Components
import ProjectMembers from './ProjectMembers';
import Integrations from './Integrations';
import DangerZone from './DangerZone';
import { Box } from 'rebass';

export interface ContentProps {
  data: Project;
}

const SettingsContent: FC<ContentProps> = ({ data }) => {
  return (
    <>
      {!!data.projectTeam && <ProjectMembers data={data} />}
      <Integrations />
      <DangerZone data={data} />
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
