import { useCallback, useMemo } from 'react';
import { matchPath, useLocation } from 'react-router-dom';

import routeNames from '../../../routes/routeNames';
// Hooks
import useNavigateRelative from '../../../hooks/useNavigateRelative';

const useTabsNavigation = () => {
  const location = useLocation();
  const navigateRelative = useNavigateRelative();

  const handleNavigateRelative = useCallback(
    (to: string, relativeTo?: string) => (): void => {
      navigateRelative(to, relativeTo);
    },
    [navigateRelative],
  );

  const isActive = useCallback(
    (pattern: string | string[]): boolean => {
      if (Array.isArray(pattern)) {
        return pattern.some((p) => !!matchPath(p, location.pathname));
      }

      return !!matchPath(pattern, location.pathname);
    },
    [location],
  );

  const tabs = useMemo(
    () => [
      {
        title: 'Profile',
        isActive: isActive(routeNames.account.profile),
        onCLick: handleNavigateRelative(routeNames.account.profile),
      },
      {
        title: 'Authentication',
        isActive: isActive(routeNames.account.auth),
        onCLick: handleNavigateRelative(routeNames.account.auth),
      },
      {
        title: 'API',
        isActive: isActive([
          routeNames.account.api.edit,
          routeNames.account.api.create,
          routeNames.account.api.list,
        ]),
        onCLick: handleNavigateRelative(routeNames.account.api.list),
      },
      {
        title: 'Secrets',
        isActive: isActive([
          routeNames.account.secrets.create,
          routeNames.account.secrets.list,
        ]),
        onCLick: handleNavigateRelative(routeNames.account.secrets.list),
      },
    ],
    [isActive, handleNavigateRelative],
  );

  return {
    tabs,
  };
};

export default useTabsNavigation;
