import { useCallback, useEffect, useMemo } from 'react';
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
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import useGetHrefForRoute from '../../../hooks/useGetHrefForRoute';
import useOS, { OSNames } from '../../../hooks/useOS';

const useAppNavigation = (): TreeNode[] => {
  const location = useLocation();
  const fgOverviewAnchors = useAnchor('fgOverview');
  const tdOverviewAnchors = useAnchor('tdOverview');
  const navigateRelative = useNavigateRelative();

  const navigate = useNavigateRelative();

  const handleShortcut = useCallback(
    (e) => {
      if (e.ctrlKey || (e.metaKey && ['0', '1', '2', '3'].includes(e.key))) {
        switch (e.key) {
          case '0': {
            navigate('/view', 'p/:id/*');
            break;
          }
          case '1': {
            navigate('/fg', 'p/:id/*');
            break;
          }
          case '2': {
            navigate('/td', 'p/:id/*');
            break;
          }
          case '3': {
            navigate('/storage-connectors', 'p/:id/*');
            break;
          }
        }

        e.preventDefault();
      }
    },
    [navigate],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleShortcut);

    return () => window.removeEventListener('keydown', handleShortcut);
  }, [handleShortcut]);

  const { name: osName } = useOS();

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

  const featureGroup = useSelector(
    (state: RootState) => state.featureGroupView,
  );
  const trainingDataset = useSelector(
    (state: RootState) => state.trainingDatasetView,
  );

  const disabledTabs = useMemo(() => {
    const fgConfig = featureGroup?.statisticsConfig;
    const tdConfig = trainingDataset?.statisticsConfig;

    const fgStatisticsDisabled = !fgConfig?.enabled || !fgConfig?.histograms;
    const fgCorrelationsDisabled =
      !fgConfig?.enabled || !fgConfig?.correlations;

    const tdStatisticsDisabled = !tdConfig?.enabled || !tdConfig?.histograms;
    const tdCorrelationsDisabled =
      !tdConfig?.enabled || !tdConfig?.correlations;

    return {
      fgStatisticsDisabled,
      fgCorrelationsDisabled,
      tdStatisticsDisabled,
      tdCorrelationsDisabled,
    };
  }, [featureGroup, trainingDataset]);

  const createFgAnchorLink = useCallback(
    (title: string, to: string, id: string) => ({
      title,
      isActive: fgOverviewAnchors.active === to,
      onClick: handleJumpToAnchor(to),
      id,
    }),
    [fgOverviewAnchors.active, handleJumpToAnchor],
  );

  const getHref = useGetHrefForRoute();

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
        tooltipText: `Home | ${osName === OSNames.MAC ? '⌘' : 'Ctrl'} + 0`,
        isActive: isActive('/p/:id/view'),
        href: getHref('/view', routeNames.project.view),
        onClick: handleNavigateRelative('/view', routeNames.project.view),
        children: [
          {
            id: 'projectDatabricks',
            title: 'Databricks',
            isActive: isActive(routeNames.project.integrations.databricks),
            href: getHref('/integrations/databricks', '/p/:id/*'),
            onClick: handleNavigateRelative(
              '/integrations/databricks',
              '/p/:id/*',
            ),
          },
          {
            id: 'projectSpark',
            title: 'Spark',
            href: getHref('/integrations/spark', '/p/:id/*'),
            isActive: isActive(routeNames.project.integrations.spark),
            onClick: handleNavigateRelative('/integrations/spark', '/p/:id/*'),
          },
          {
            id: 'projectCode',
            href: getHref('/integrations/code', '/p/:id/*'),
            title: 'Connect to Feature Store',
            isActive: isActive(routeNames.project.integrations.code),
            onClick: handleNavigateRelative('/integrations/code', '/p/:id/*'),
          },
        ],
      },
      {
        id: 'fg',
        title: 'Feature Groups',
        tooltipText: `Feature Groups | ${
          osName === OSNames.MAC ? '⌘' : 'Ctrl'
        } + 1`,
        icon: fg,
        onClick: handleNavigateRelative(
          routeNames.featureGroup.list,
          routeNames.project.view,
        ),
        href: getHref(routeNames.featureGroup.list, routeNames.project.view),
        isActive: isActive('/p/:id/fg'),
        children: [
          {
            id: 'fgOverview',
            title: 'Overview',
            href: getHref('/', '/p/:id/fg/:fgId/*'),
            isActive: isActive('/p/:id/fg/:fgId', ['new']),
            onClick: handleNavigateRelative('/', '/p/:id/fg/:fgId/*'),
            children: [
              createFgAnchorLink('Feature List', featureList, 'fgFeatures'),
              createFgAnchorLink('Provenance', provenance, 'fgProvenance'),
              createFgAnchorLink('Schematised Tags', schematisedTags, 'fgTags'),
              createFgAnchorLink('API', api, 'fgApi'),
            ],
          },
          {
            id: 'fgDataPreview',
            title: 'Data preview',
            href: getHref('/data-preview', '/p/:id/fg/:fgId/*'),
            isActive: isActive('p/:id/fg/:fgId/data-preview/*'),
            onClick: handleNavigateRelative(
              '/data-preview',
              '/p/:id/fg/:fgId/*',
            ),
          },
          {
            id: 'fgStats',
            title: 'Feature statistics',
            href: getHref('/statistics', '/p/:id/fg/:fgId/*'),
            disabled: disabledTabs.fgStatisticsDisabled,
            isActive: isActive('/p/:id/fg/:fgId/statistics/*'),
            onClick: handleNavigateRelative('/statistics', '/p/:id/fg/:fgId/*'),
          },
          {
            id: 'fgCorrelation',
            title: 'Feature correlations',
            href: getHref('/correlation', '/p/:id/fg/:fgId/*'),
            disabled: disabledTabs.fgCorrelationsDisabled,
            isActive: isActive('/p/:id/fg/:fgId/correlation/*'),
            onClick: handleNavigateRelative(
              '/correlation',
              '/p/:id/fg/:fgId/*',
            ),
          },
          {
            id: 'fgActivity',
            title: 'Activity',
            href: getHref('/activity', '/p/:id/fg/:fgId/*'),
            onClick: handleNavigateRelative('/activity', '/p/:id/fg/:fgId/*'),
            isActive: isActive([
              '/p/:id/fg/:fgId/activity',
              '/p/:id/fg/:fgId/activity/:type',
              '/p/:id/fg/:fgId/activity/:type/:from/:to',
              '/p/:id/fg/:fgId/activity/:from/:to',
            ]),
          },
        ],
      },
      {
        id: 'td',
        title: 'Training Datasets',
        tooltipText: `Training Datasets | ${
          osName === OSNames.MAC ? '⌘' : 'Ctrl'
        } + 2`,
        icon: td,
        isActive: isActive('/p/:id/td'),
        href: getHref(routeNames.trainingDataset.list, routeNames.project.view),
        onClick: handleNavigateRelative(
          routeNames.trainingDataset.list,
          routeNames.project.view,
        ),
        children: [
          {
            id: 'tdOverview',
            title: 'Overview',
            href: getHref('/', '/p/:id/td/:tdId/*'),
            isActive: isActive('/p/:id/td/:tdId', ['new']),
            onClick: handleNavigateRelative('/', '/p/:id/td/:tdId/*'),
            children: [
              createTdAnchorLink('Feature List', featureList, 'tdFeatures'),
              createTdAnchorLink('Provenance', provenance, 'tdProvenance'),
              createTdAnchorLink('Schematised Tags', schematisedTags, 'tdTags'),
              createTdAnchorLink('Query', runningCode, 'tdCode'),
              createTdAnchorLink('API', api, 'tdApi'),
              createTdAnchorLink('Splits', splitGraph, 'tdSplitGraph'),
            ],
          },
          {
            id: 'tdStats',
            href: getHref('/statistics', '/p/:id/td/:tdId/*'),
            title: 'Feature statistics',
            disabled: disabledTabs.tdStatisticsDisabled,
            isActive: isActive('/p/:id/td/:tdId/statistics/*'),
            onClick: handleNavigateRelative('/statistics', '/p/:id/td/:tdId/*'),
          },
          {
            id: 'tdCorrelation',
            title: 'Feature correlations',
            href: getHref('/correlation', '/p/:id/td/:tdId/*'),
            disabled: disabledTabs.tdCorrelationsDisabled,
            isActive: isActive(routeNames.trainingDataset.correlation),
            onClick: handleNavigateRelative(
              '/correlation',
              '/p/:id/td/:tdId/*',
            ),
          },
          {
            id: 'tdActivity',
            title: 'Activity',
            href: getHref('/activity', '/p/:id/td/:tdId/*'),
            onClick: handleNavigateRelative('/activity', '/p/:id/td/:tdId/*'),
            isActive: isActive('/p/:id/td/:tdId/activity'),
          },
        ],
      },
      {
        id: 'sc',
        title: 'Storage Connectors',
        icon: sources,
        tooltipText: `Storage Connectors | ${
          osName === OSNames.MAC ? '⌘' : 'Ctrl'
        } + 3`,
        href: getHref(
          routeNames.storageConnector.list,
          routeNames.project.view,
        ),
        isActive: location.pathname.includes(routeNames.storageConnector.list),
        onClick: handleNavigateRelative(
          routeNames.storageConnector.list,
          routeNames.project.view,
        ),
      },
    ];
  }, [
    osName,
    createFgAnchorLink,
    createTdAnchorLink,
    location,
    isActive,
    getHref,
    handleNavigateRelative,
    disabledTabs,
  ]);
};

export default useAppNavigation;
