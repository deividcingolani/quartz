import React, { FC } from 'react';
import { Header } from '@logicalclocks/quartz';

// Components
import ProjectsDropdown from './ProjectsDropdown';

const AppHeader: FC = () => {
  return (
    <Header>
      <ProjectsDropdown />
    </Header>
  );
};

export default AppHeader;
