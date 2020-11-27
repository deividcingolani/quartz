import { useCallback, useMemo } from 'react';
import { matchPath, useLocation } from 'react-router-dom';
// eslint-disable-next-line import/no-unresolved
import { TreeNode } from '@logicalclocks/quartz/dist/components/navigation/types';
import useAnchor from '../../../components/anchor/useAnchor';

// Route names
import routeNames from '../../../routes/routeNames';
// Hooks
import useNavigateRelative from '../../../hooks/useNavigateRelative';
// Svg
import sources from '../../../sources/source_02rev.json';
import td from '../../../sources/TD_01 (1).json';
import fg from '../../../sources/FG_06.json';
import home from '../../../sources/home.json';
import jobs from '../../../sources/runjobs.json';
import meta from '../../../sources/meta-03.json';
import query from '../../../sources/query-04.json';

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
    (pattern: string | string[], notContains: string[] = []): boolean => {
      if (notContains.some((word) => location.pathname.includes(word))) {
        return false;
      }
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
        icon: home,
        hasDivider: true,
        isActive: isActive('/p/:id/view'),
        onClick: handleNavigateRelative('/view', routeNames.project.view),
      },
      {
        title: 'Feature Groups',
        icon: fg,
        onClick: handleNavigateRelative(
          routeNames.featureGroup.list,
          routeNames.project.view,
        ),
        isActive: isActive('/p/:id/fg'),
        children: [
          {
            title: 'Overview',
            isActive: isActive('/p/:id/fg/:fgId', ['new']) && !location.hash,
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
              '/data-preview',
              '/p/:id/fg/:fgId/*',
            ),
            isActive: isActive('/p/:id/fg/:fgId/activity'),
            children: [
              {
                title: 'Data Preview',
                isActive: isActive('p/:id/fg/:fgId/data-preview/*'),
                onClick: handleNavigateRelative(
                  '/data-preview',
                  '/p/:id/fg/:fgId/*',
                ),
              },
              {
                title: 'Feature Statistics',
                isActive: isActive('/p/:id/fg/:fgId/statistics/*'),
                onClick: handleNavigateRelative(
                  '/statistics',
                  '/p/:id/fg/:fgId/*',
                ),
              },
              {
                title: 'Correlation',
                isActive: isActive(routeNames.featureGroup.dataCorrelation),
              },
            ],
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
        icon: td,
        hasDivider: true,

        isActive: location.pathname.includes(routeNames.trainingDatasetList),
        onClick: handleNavigateRelative(
          routeNames.trainingDatasetList,
          'p/:id/*',
        ),
      },
      {
        title: 'Sources',
        icon: sources,

        isActive: location.pathname.includes(routeNames.source.list),
        onClick: handleNavigateRelative(routeNames.source.list, 'p/:id/*'),
      },
    ];
  }, [createAnchorLink, location, isActive, handleNavigateRelative]);
};

export default useAppNavigation;
