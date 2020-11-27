import React, { FC } from 'react';
import { Header } from '@logicalclocks/quartz';

// Components
import ProjectsDropdown from './ProjectsDropdown';

export interface AppHeaderProps {
  showList?: boolean;
}

const AppHeader: FC<AppHeaderProps> = ({ showList = true }) => {
  return <Header>{showList && <ProjectsDropdown />}</Header>;
};

export default AppHeader;
