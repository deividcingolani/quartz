import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// eslint-disable-next-line import/no-unresolved
import { TreeNode } from '@logicalclocks/quartz/dist/components/navigation/types';

// Route names
import routeNames from '../../../routes/routeNames';
import useProjectNavigate from '../../../hooks/useProjectNavigate';

const useAppNavigation = (): TreeNode[] => {
  const location = useLocation();
  const navigate = useNavigate();
  const navigateProject = useProjectNavigate();

  const handleRedirect = useCallback((to: string) => (): void => navigate(to), [
    navigate,
  ]);

  const handleRedirectProject = useCallback(
    (to: string) => (): void => {
      navigateProject(to);
    },
    [navigateProject],
  );

  return useMemo<TreeNode[]>(() => {
    return [
      {
        title: 'Home',
        icon: ['far', 'copy'],
        hasDivider: true,

        isActive: location.pathname === routeNames.home,
        onClick: handleRedirect(routeNames.home),
      },
      {
        title: 'Feature Groups',
        icon: ['far', 'copy'],
        isActive: location.pathname.includes('fg'),
        onClick: handleRedirectProject(routeNames.featureGroupList),
        children: [
          {
            title: 'Overview',
            children: [
              {
                title: 'Feature List',
              },
              {
                title: 'Schematised Tags',
              },
              {
                title: 'Running Code',
              },
              {
                title: 'API',
              },
            ],
          },
        ],
      },
    ];
  }, [location.pathname, handleRedirectProject, handleRedirect]);
};

export default useAppNavigation;
