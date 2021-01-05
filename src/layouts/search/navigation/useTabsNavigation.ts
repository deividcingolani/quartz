import { useCallback, useMemo } from 'react';
import { matchPath, useLocation } from 'react-router-dom';

import routeNames from '../../../routes/routeNames';
// Hooks
import useNavigateRelative from '../../../hooks/useNavigateRelative';

const useTabsNavigation = () => {
  const location = useLocation();
  const navigateRelative = useNavigateRelative();

  const { projectId, searchText } = useMemo(() => {
    const [, , projectId] = location.pathname.match(/(p)\/(\d+)/) || [];
    const [, , searchText] =
      location.pathname.match(/(features|td|fg)\/(.*)/) || [];

    return {
      projectId: +projectId,
      searchText,
    };
  }, [location.pathname]);

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

  const getRedirectPath = useCallback(
    (name: string) => {
      if (searchText && projectId) {
        return `search/p/${projectId}/${name}/${searchText}`;
      }
      if (searchText) {
        return `search/${name}/${searchText}`;
      }
      if (projectId) {
        return `search/p/${projectId}/${name}`;
      }
      return `search/${name}`;
    },
    [projectId, searchText],
  );

  const tabs = useMemo(() => {
    return [
      {
        title: 'Features',
        isActive: isActive([
          `search/${routeNames.search.searchAllProjectsFeaturesWithoutSearch}`,
          `search/${routeNames.search.searchAllProjectsFeatures}`,
          `search/${routeNames.search.searchOneProjectFeaturesWithoutSearch}`,
          `search/${routeNames.search.searchOneProjectFeatures}`,
        ]),
        onCLick: handleNavigateRelative(getRedirectPath('features')),
      },
      {
        title: 'Feature Groups',
        isActive: isActive([
          `search/${routeNames.search.searchAllProjectsFeatureGroupsWithoutSearch}`,
          `search/${routeNames.search.searchAllProjectsFeatureGroups}`,
          `search/${routeNames.search.searchOneProjectFeatureGroupsWithoutSearch}`,
          `search/${routeNames.search.searchOneProjectFeatureGroups}`,
        ]),
        onCLick: handleNavigateRelative(getRedirectPath('fg')),
      },
      {
        title: 'Training Datasets',
        isActive: isActive([
          `search/${routeNames.search.searchAllProjectsTrainingDatasetsWithoutSearch}`,
          `search/${routeNames.search.searchAllProjectsTrainingDatasets}`,
          `search/${routeNames.search.searchOneProjectTrainingDatasetsWithoutSearch}`,
          `search/${routeNames.search.searchOneProjectTrainingDatasets}`,
        ]),
        onCLick: handleNavigateRelative(getRedirectPath('td')),
      },
    ];
  }, [isActive, handleNavigateRelative, getRedirectPath]);

  return {
    tabs,
  };
};

export default useTabsNavigation;
