import React, { useCallback, useMemo } from 'react';
import { matchPath, useLocation } from 'react-router-dom';

import routeNames from '../../../routes/routeNames';
// Hooks
import useNavigateRelative from '../../../hooks/useNavigateRelative';
import useSearchDataCount from '../../../pages/search/hooks/useSearchDataCount';
import { Value } from '@logicalclocks/quartz';

const useTabsNavigation = () => {
  const location = useLocation();
  const navigateRelative = useNavigateRelative();

  const { projectId, searchText, query } = useMemo(() => {
    const [, , projectId] = location.pathname.match(/(p)\/(\d+)/) || [];
    const [, , searchText] =
      location.pathname.match(/(features|td|fg)\/(.*)/) || [];

    return {
      projectId: +projectId,
      searchText,
      query: location.search,
    };
  }, [location.pathname, location.search]);

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
        return `search/p/${projectId}/${name}/${searchText}${query}`;
      }
      if (searchText) {
        return `search/${name}/${searchText}${query}`;
      }
      if (projectId) {
        return `search/p/${projectId}/${name}/${query}`;
      }
      return `search/${name}/${query}`;
    },
    [projectId, searchText, query],
  );

  const { data, isLoading } = useSearchDataCount(projectId, searchText);

  const altContent = useCallback(
    (count: number) =>
      data && !isLoading ? (
        <Value
          as="span"
          lineHeight="13px"
          style={!count ? { color: 'gray' } : {}}
        >
          {count || 0}
        </Value>
      ) : null,
    [data, isLoading],
  );

  const tabs = useMemo(() => {
    return [
      {
        title: 'Feature Groups',
        isActive: isActive([
          `search/${routeNames.search.searchAllProjectsFeatureGroupsWithoutSearch}`,
          `search/${routeNames.search.searchAllProjectsFeatureGroups}`,
          `search/${routeNames.search.searchOneProjectFeatureGroupsWithoutSearch}`,
          `search/${routeNames.search.searchOneProjectFeatureGroups}`,
        ]),
        onCLick: handleNavigateRelative(getRedirectPath('fg')),
        altContent: altContent(data?.featureGroups || 0),
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
        altContent: altContent(data?.trainingDatasets || 0),
      },
      {
        title: 'Features',
        isActive: isActive([
          `search/${routeNames.search.searchAllProjectsFeaturesWithoutSearch}`,
          `search/${routeNames.search.searchAllProjectsFeatures}`,
          `search/${routeNames.search.searchOneProjectFeaturesWithoutSearch}`,
          `search/${routeNames.search.searchOneProjectFeatures}`,
        ]),
        onCLick: handleNavigateRelative(getRedirectPath('features')),
        altContent: altContent(data?.features || 0),
      },
    ];
  }, [isActive, handleNavigateRelative, getRedirectPath, altContent, data]);

  return {
    tabs,
  };
};

export default useTabsNavigation;
