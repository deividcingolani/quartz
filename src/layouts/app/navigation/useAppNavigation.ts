import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// eslint-disable-next-line import/no-unresolved
import { TreeNode } from 'quartz-design-system/dist/components/navigation/types';

// Route names
import routeNames from '../../../routes/routeNames';

const useAppNavigation = (): TreeNode[] => {
  const location = useLocation();
  const navigate = useNavigate();

  const redirect = useCallback(
    (route: string) => (): void => {
      navigate(route);
    },
    [navigate],
  );

  return useMemo<TreeNode[]>(() => {
    return [
      {
        title: 'Home',
        icon: ['far', 'copy'],
        hasDivider: true,

        // Todo: Create utility for it
        isActive: location.pathname === routeNames.home,
        onClick: redirect(routeNames.home),
      },
    ];
  }, [location.pathname, redirect]);
};

export default useAppNavigation;
