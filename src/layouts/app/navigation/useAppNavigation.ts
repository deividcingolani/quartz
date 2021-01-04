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

const useAppNavigation = (): TreeNode[] => {
  const location = useLocation();
  const fgOverviewAnchors = useAnchor('fgOverview');
  const tdOverviewAnchors = useAnchor('tdOverview');
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

  const createFgAnchorLink = useCallback(
    (title: string, to: string, id: string) => ({
      title,
      isActive: fgOverviewAnchors.active === to,
      onClick: handleJumpToAnchor(to),
      id,
    }),
    [fgOverviewAnchors.active, handleJumpToAnchor],
  );

  const createTdAnchorLink = useCallback(
    (title: string, to: string, id: string) => ({
      title,
      isActive: tdOverviewAnchors.active === to,
      onClick: handleJumpToAnchor(to),
      id,
    }),
    [tdOverviewAnchors.active, handleJumpToAnchor],
  );

  return useMemo<TreeNode[]>(() => {
    const {
      featureList,
      provenance,
      schematisedTags,
      pipelineHistory,
      runningCode,
      api,
      splitGraph,
    } = routeNames.overviewAnchors;

    return [
      {
        id: 'home',
        title: 'Home',
        icon: home,
        hasDivider: true,
        tooltipText: 'Home',
        isActive: isActive('/p/:id/view'),
        onClick: handleNavigateRelative('/view', routeNames.project.view),
      },
      {
        id: 'fg',
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
            id: 'fgOverview',
            title: 'Overview',
            isActive: isActive('/p/:id/fg/:fgId', ['new']) && !location.hash,
            onClick: handleNavigateRelative('/', '/p/:id/fg/:fgId/*'),
            children: [
              createFgAnchorLink('Feature List', featureList, 'fgFeatures'),
              createFgAnchorLink('Provenance', provenance, 'fgProvenance'),
              createFgAnchorLink('Schematised Tags', schematisedTags, 'fgTags'),
              createFgAnchorLink(
                'Pipeline History',
                pipelineHistory,
                'fgPipeline',
              ),
              createFgAnchorLink('Running Code', runningCode, 'fgCode'),
              createFgAnchorLink('API', api, 'fgApi'),
            ],
          },
          {
            id: 'fgData',
            title: 'Data',
            onClick: handleNavigateRelative(
              '/data-preview',
              '/p/:id/fg/:fgId/*',
            ),
            isActive: isActive('/p/:id/fg/:fgId/activity'),
            children: [
              {
                id: 'fgDataPreview',
                title: 'Data Preview',
                isActive: isActive('p/:id/fg/:fgId/data-preview/*'),
                onClick: handleNavigateRelative(
                  '/data-preview',
                  '/p/:id/fg/:fgId/*',
                ),
              },
              {
                id: 'fgStats',
                title: 'Feature Statistics',
                isActive: isActive('/p/:id/fg/:fgId/statistics/*'),
                onClick: handleNavigateRelative(
                  '/statistics',
                  '/p/:id/fg/:fgId/*',
                ),
              },
              {
                id: 'fgCorrelation',
                title: 'Correlation',
                isActive: isActive(routeNames.featureGroup.correlation),
                onClick: handleNavigateRelative(
                  '/correlation',
                  '/p/:id/fg/:fgId/*',
                ),
              },
            ],
          },
          {
            id: 'fgActivity',
            title: 'Activity',
            onClick: handleNavigateRelative('/activity', '/p/:id/fg/:fgId/*'),
            isActive: isActive('/p/:id/fg/:fgId/activity'),
          },
        ],
      },
      {
        id: 'td',
        title: 'Training Datasets',
        tooltipText: 'Training Datasets',
        icon: td,
        isActive: isActive('/p/:id/td'),
        onClick: handleNavigateRelative(
          routeNames.trainingDataset.list,
          routeNames.project.view,
        ),
        children: [
          {
            id: 'tdOverview',
            title: 'Overview',
            isActive: isActive('/p/:id/td/:tdId') && !location.hash,
            onClick: handleNavigateRelative('/', '/p/:id/td/:tdId/*'),
            children: [
              createTdAnchorLink('Feature List', featureList, 'tdFeatures'),
              createTdAnchorLink('Provenance', provenance, 'tdProvenance'),
              createTdAnchorLink('Schematised Tags', schematisedTags, 'tdTags'),
              createTdAnchorLink(
                'Pipeline History',
                pipelineHistory,
                'tdPipeline',
              ),
              createTdAnchorLink('Query', runningCode, 'tdCode'),
              createTdAnchorLink('API', api, 'tdApi'),
              createTdAnchorLink('Splits', splitGraph, 'tdSplitGraph'),
            ],
          },
          {
            id: 'tdData',
            title: 'Data',
            onClick: handleNavigateRelative('/statistics', '/p/:id/td/:tdId/*'),
            isActive: isActive('/p/:id/td/:tdId/activity'),
            children: [
              {
                id: 'tdStats',
                title: 'Feature Statistics',
                isActive: isActive('/p/:id/td/:tdId/statistics/*'),
                onClick: handleNavigateRelative(
                  '/statistics',
                  '/p/:id/td/:tdId/*',
                ),
              },
              {
                id: 'tdCorrelation',
                title: 'Correlation',
                isActive: isActive(routeNames.featureGroup.correlation),
                onClick: handleNavigateRelative(
                  '/correlation',
                  '/p/:id/td/:tdId/*',
                ),
              },
            ],
          },
          {
            id: 'tdActivity',
            title: 'Activity',
            onClick: handleNavigateRelative('/activity', '/p/:id/td/:tdId/*'),
            isActive: isActive('/p/:id/td/:tdId/activity'),
          },
        ],
      },
      {
        id: 'sc',
        title: 'Sources',
        icon: sources,
        tooltipText: 'Sources',
        isActive: location.pathname.includes(routeNames.source.list),
        onClick: handleNavigateRelative(
          routeNames.source.list,
          routeNames.project.view,
        ),
      },
    ];
  }, [
    createFgAnchorLink,
    createTdAnchorLink,
    location,
    isActive,
    handleNavigateRelative,
  ]);
};

export default useAppNavigation;
