import React, { FC, memo, useCallback } from 'react';
import { Navigation } from '@logicalclocks/quartz';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';

// Components
import Footer from './Footer';
// Hooks
import useAppNavigation from './useAppNavigation';
import useNavigateRelative from '../../../hooks/useNavigateRelative';

const map: { [key: string]: string } = {
  'p/:id/fg/:id/statistics/*': '/fg',
};

const AppNavigation: FC = () => {
  const treeNavigation = useAppNavigation();
  const navigate = useNavigate();

  const location = useLocation();

  const navigateRelative = useNavigateRelative();

  const handleBack = useCallback(() => {
    const [[, route] = []] = Object.entries(map).filter(([pattern]) =>
      matchPath(pattern, location.pathname),
    );

    if (route) {
      navigateRelative(route, 'p/:id/*');
    } else {
      navigate(-1);
    }
  }, [navigate, location.pathname, navigateRelative]);

  return (
    <Navigation
      tree={treeNavigation}
      onBackCLick={handleBack}
      footer={<Footer />}
    />
  );
};

export default memo(AppNavigation);
