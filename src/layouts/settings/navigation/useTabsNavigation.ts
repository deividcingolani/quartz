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
        title: 'Schematised tags',
        isActive: isActive(routeNames.settings.schematisedTags.list),
        onCLick: handleNavigateRelative(
          routeNames.settings.schematisedTags.list,
        ),
      },
    ],
    [isActive, handleNavigateRelative],
  );

  return {
    tabs,
  };
};

export default useTabsNavigation;
