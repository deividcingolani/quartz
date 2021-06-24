// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo, useCallback } from 'react';
import { Navigation } from '@logicalclocks/quartz';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';

// Components
import { useSelector } from 'react-redux';
import Footer from './Footer';
// Hooks
import useAppNavigation from './useAppNavigation';
import useNavigateRelative from '../../../hooks/useNavigateRelative';
import { RootState } from '../../../store';
import ErrorBoundary from '../../../components/error-boundary/ErrorBoundary';

const map: { [key: string]: string } = {
  'p/:id/fg/:id/*': '/fg',
  'p/:id/fg/:id/data-preview': '/fg',
  'p/:id/fg/:id/statistics/*': '/fg',
  'p/:id/fg/:id/correlation': '/fg',
  'p/:id/fg/:id/activity': '/fg',
  'p/:id/settings/*': '/',
  'p/:id/jobs/:id': '/jobs',
  'p/:id/jobs/:id/executions': '/jobs',
  'p/:id/settings/integrations/*': '/',
};

const AppNavigation: FC = () => {
  const treeNavigation = useAppNavigation();
  const navigate = useNavigate();

  const location = useLocation();

  const navigateRelative = useNavigateRelative();

  const globalError = useSelector(
    (state: RootState) => state.error.globalError,
  );

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

  if (globalError && globalError.config?.method === 'get') {
    return null;
  }

  return (
    <Navigation
      trackBy="id"
      tree={treeNavigation}
      onBackCLick={handleBack}
      footer={<Footer />}
    />
  );
};

const withErrorBoundary = () => (
  <ErrorBoundary>
    <AppNavigation />
  </ErrorBoundary>
);

export default memo(withErrorBoundary);
