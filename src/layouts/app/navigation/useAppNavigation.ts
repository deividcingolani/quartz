import { useCallback, useMemo } from 'react';
import { matchPath, useLocation } from 'react-router-dom';
// eslint-disable-next-line import/no-unresolved
import { TreeNode } from '@logicalclocks/quartz/dist/components/navigation/types';
import useAnchor from '../../../components/anchor/useAnchor';

// Route names
import routeNames from '../../../routes/routeNames';
// Hooks
import useNavigateRelative from '../../../hooks/useNavigateRelative';

const useAppNavigation = (): TreeNode[] => {
  const location = useLocation();
  const overviewAnchors = useAnchor('overview');
  const navigateRelative = useNavigateRelative();

  const handleNavigateRelative = useCallback(
    (to: string, relativeTo?: string) => (): void => {
      navigateRelative(to, relativeTo);
    },
    [navigateRelative],
  );

  const handleJumpToAnchor = useCallback(
    (anchor: string) => () => {
      window.location.hash = `#${anchor}`;
    },
    [],
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

  const createAnchorLink = useCallback(
    (title: string, to: string) => ({
      title,
      isActive: overviewAnchors.active === to,
      onClick: handleJumpToAnchor(to),
    }),
    [overviewAnchors.active, handleJumpToAnchor],
  );

  return useMemo<TreeNode[]>(() => {
    const {
      featureList,
      schematisedTags,
      pipelineHistory,
      runningCode,
      api,
    } = routeNames.featureGroup.overviewAnchors;

    return [
      {
        title: 'Home',
        icon: ['far', 'copy'],
        hasDivider: true,

        onClick: handleNavigateRelative(routeNames.home),
      },
      {
        title: 'Feature Groups',
        icon: ['far', 'copy'],
        onClick: handleNavigateRelative(
          routeNames.featureGroup.list,
          routeNames.project.view,
        ),
        isActive: isActive('/p/:id/fg'),
        children: [
          {
            title: 'Overview',
            isActive: isActive('/p/:id/fg/:fgId') && !location.hash,
            onClick: handleNavigateRelative('/', '/p/:id/fg/:fgId/*'),
            children: [
              createAnchorLink('Feature List', featureList),
              createAnchorLink('Schematised Tags', schematisedTags),
              createAnchorLink('Pipeline History', pipelineHistory),
              createAnchorLink('Running Code', runningCode),
              createAnchorLink('API', api),
            ],
          },
          {
            title: 'Data',
            onClick: handleNavigateRelative(
              '/data/preview',
              '/p/:id/fg/:fgId/*',
            ),
            isActive: isActive('/p/:id/fg/:fgId/activity'),
          },
          {
            title: 'Activity',
            onClick: handleNavigateRelative('/activity', '/p/:id/fg/:fgId/*'),
            isActive: isActive('/p/:id/fg/:fgId/activity'),
          },
        ],
      },

      {
        title: 'Training Datasets',
        icon: ['far', 'copy'],
        hasDivider: true,

        isActive: location.pathname.includes(routeNames.trainingDatasetList),
        onClick: handleNavigateRelative(
          routeNames.trainingDatasetList,
          'p/:id/*',
        ),
      },
    ];
  }, [createAnchorLink, location, isActive, handleNavigateRelative]);
};

export default useAppNavigation;
