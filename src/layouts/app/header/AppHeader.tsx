import React, { FC } from 'react';
import { Header } from 'quartz-design-system';

// Components
import ProjectsButton from './ProjectsButton';

const AppHeader: FC = () => {
  return (
    <Header>
      <ProjectsButton />
    </Header>
  );
};

export default AppHeader;
