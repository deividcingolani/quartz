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
    (title: string, to: string, id: string) => ({
      title,
      isActive: overviewAnchors.active === to,
      onClick: handleJumpToAnchor(to),
      id,
    }),
    [overviewAnchors.active, handleJumpToAnchor],
  );

  return useMemo<TreeNode[]>(() => {
    const {
      featureList,
      provenance,
      schematisedTags,
      pipelineHistory,
      runningCode,
      api,
    } = routeNames.featureGroup.overviewAnchors;

    return [
      {
        id: '1',
        title: 'Home',
        icon: home,
        hasDivider: true,
        tooltipText: 'Home',
        isActive: isActive('/p/:id/view'),
        onClick: handleNavigateRelative('/view', routeNames.project.view),
      },
      {
        id: '2',
        title: 'Feature Groups',
        tooltipText: 'Feature Groups',
        icon: fg,
        onClick: handleNavigateRelative(
          routeNames.featureGroup.list,
          routeNames.project.view,
        ),
        isActive: isActive('/p/:id/fg'),
        children: [
          {
            id: '3',
            title: 'Overview',
            isActive: isActive('/p/:id/fg/:fgId', ['new']) && !location.hash,
            onClick: handleNavigateRelative('/', '/p/:id/fg/:fgId/*'),
            children: [
              createAnchorLink('Feature List', featureList, '11'),
              createAnchorLink('Schematised Tags', schematisedTags, '12'),
              createAnchorLink('Pipeline History', pipelineHistory, '13'),
              createAnchorLink('Running Code', runningCode, '14'),
              createAnchorLink('API', api, '15'),
              createAnchorLink('Feature List', featureList, '11'),
              createAnchorLink('Provenance', provenance, '16'),
              createAnchorLink('Schematised Tags', schematisedTags, '12'),
              createAnchorLink('Pipeline History', pipelineHistory, '13'),
              createAnchorLink('Running Code', runningCode, '14'),
              createAnchorLink('API', api, '15'),
            ],
          },
          {
            id: '4',
            title: 'Data',
            onClick: handleNavigateRelative(
              '/data-preview',
              '/p/:id/fg/:fgId/*',
            ),
            isActive: isActive('/p/:id/fg/:fgId/activity'),
            children: [
              {
                id: '5',
                title: 'Data Preview',
                isActive: isActive('p/:id/fg/:fgId/data-preview/*'),
                onClick: handleNavigateRelative(
                  '/data-preview',
                  '/p/:id/fg/:fgId/*',
                ),
              },
              {
                id: '6',
                title: 'Feature Statistics',
                isActive: isActive('/p/:id/fg/:fgId/statistics/*'),
                onClick: handleNavigateRelative(
                  '/statistics',
                  '/p/:id/fg/:fgId/*',
                ),
              },
              {
                id: '7',
                title: 'Correlation',
                isActive: isActive(routeNames.featureGroup.dataCorrelation),
              },
            ],
          },
          {
            id: '8',
            title: 'Activity',
            onClick: handleNavigateRelative('/activity', '/p/:id/fg/:fgId/*'),
            isActive: isActive('/p/:id/fg/:fgId/activity'),
          },
        ],
      },
      {
        id: '9',
        title: 'Training Datasets',
        tooltipText: 'Training Datasets',
        icon: td,
        hasDivider: true,

        isActive: location.pathname.includes(routeNames.trainingDatasetList),
        onClick: handleNavigateRelative(
          routeNames.trainingDatasetList,
          'p/:id/*',
        ),
      },
      {
        id: '10',
        title: 'Sources',
        icon: sources,
        tooltipText: 'Sources',
        isActive: location.pathname.includes(routeNames.source.list),
        onClick: handleNavigateRelative(routeNames.source.list, 'p/:id/*'),
      },
    ];
  }, [createAnchorLink, location, isActive, handleNavigateRelative]);
};

export default useAppNavigation;
