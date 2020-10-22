import React, { FC } from 'react';
import { Navigation } from '@logicalclocks/quartz';

// Components
import Footer from './Footer';
// Hooks
import useAppNavigation from './useAppNavigation';

const AppNavigation: FC = () => {
  const treeNavigation = useAppNavigation();

  return <Navigation tree={treeNavigation} footer={<Footer />} />;
};

export default AppNavigation;
