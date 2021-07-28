import { useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo } from 'react';
import { matchPath, useLocation } from 'react-router-dom';
// eslint-disable-next-line import/no-unresolved
import { TreeNode } from '@logicalclocks/quartz/dist/components/navigation/types';

// Types
import { RootState } from '../../../store';
// Route names
import routeNames from '../../../routes/routeNames';
// Hooks
import useOS, { OSNames } from '../../../hooks/useOS';
import useAnchor from '../../../components/anchor/useAnchor';
import useNavigateRelative from '../../../hooks/useNavigateRelative';

// Svg
import useGetHrefForRoute from '../../../hooks/useGetHrefForRoute';
import icons from '../../../sources/icons';

const useAppNavigation = (): TreeNode[] => {
  const location = useLocation();
  const fgOverviewAnchors = useAnchor('fgOverview');
  const tdOverviewAnchors = useAnchor('tdOverview');
  const navigateRelative = useNavigateRelative();

  const navigate = useNavigateRelative();

  const handleShortcut = useCallback(
    (e) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        ['0', '1', '2', '3', '4', '5'].includes(e.key)
      ) {
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
          case '4': {
            navigate('/jobs', 'p/:id/*');
            break;
          }
          case '5': {
            navigate('/settings/general', 'p/:id/*');
            break;
          }
          default:
          // Do nothing
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

  const featureGroupStatistics = useSelector(
    (state: RootState) => state.featureGroupStatistics,
  );

  const trainingDataset = useSelector(
    (state: RootState) => state.trainingDatasetView,
  );

  const disabledTabs = useMemo(() => {
    const fgConfig = featureGroup?.statisticsConfig;
    const tdConfig = trainingDataset?.statisticsConfig;

    const fgStatisticsDisabled = !featureGroupStatistics;

    const fgCorrelationsDisabled =
      !fgConfig?.enabled || !fgConfig?.correlations;

    const tdStatisticsDisabled = !tdConfig?.enabled;
    const tdCorrelationsDisabled =
      !tdConfig?.enabled || !tdConfig?.correlations;

    const dataPreviewDisabled =
      featureGroup?.type === 'onDemandFeaturegroupDTO';

    return {
      fgStatisticsDisabled,
      fgCorrelationsDisabled,
      tdStatisticsDisabled,
      tdCorrelationsDisabled,
      dataPreviewDisabled,
    };
  }, [featureGroup, trainingDataset, featureGroupStatistics]);

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
      expectations,
      schematisedTags,
      api,
      splitGraph,
    } = routeNames.overviewAnchors;

    return [
      {
        id: 'home',
        title: 'Home',
        icon: icons.home,
        hasDivider: true,
        tooltipText: `Home ${osName === OSNames.MAC ? '⌘' : 'Ctrl'} + 0`,
        isActive: isActive('/p/:id/view'),
        href: getHref('/view', routeNames.project.view),
        onClick: handleNavigateRelative('/view', routeNames.project.view),
      },
      { id: 'Feature Store', title: 'Feature Store' },
      {
        id: 'fg',
        title: 'Feature Groups',
        tooltipText: `Feature Groups ${
          osName === OSNames.MAC ? '⌘' : 'Ctrl'
        } + 1`,
        icon: icons.fg,
        onClick: handleNavigateRelative(
          routeNames.featureGroup.list,
          routeNames.project.view,
        ),
        href: getHref(routeNames.featureGroup.list, routeNames.project.view),
        isActive: isActive([
          '/p/:id/fg',
          '/p/:id/expectation/attach/:fgId',
          '/p/:id/expectation/:expId',
        ]),
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
              createFgAnchorLink(
                'Expectations',
                expectations,
                'fgExpectations',
              ),
              createFgAnchorLink('Tags', schematisedTags, 'fgTags'),
              createFgAnchorLink('API', api, 'fgApi'),
            ],
          },
          {
            id: 'fgDataPreview',
            title: 'Data preview',
            href: getHref('/data-preview', '/p/:id/fg/:fgId/*'),
            disabled: disabledTabs.dataPreviewDisabled,
            isActive: isActive('p/:id/fg/:fgId/data-preview/*'),
            onClick: handleNavigateRelative(
              '/data-preview',
              '/p/:id/fg/:fgId/*',
            ),
          },
          {
            id: 'fgStats',
            title: 'Feature statistics',
            tooltipText: disabledTabs.fgStatisticsDisabled
              ? 'Statistics are disabled'
              : '',
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
            tooltipText: disabledTabs.fgCorrelationsDisabled
              ? 'Correlation are disabled'
              : '',
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
        tooltipText: `Training Datasets ${
          osName === OSNames.MAC ? '⌘' : 'Ctrl'
        } + 2`,
        icon: icons.td,
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
              createTdAnchorLink('Tags', schematisedTags, 'tdTags'),
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
            tooltipText: disabledTabs.tdStatisticsDisabled
              ? 'Statistics are disabled'
              : '',
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
            tooltipText: disabledTabs.tdCorrelationsDisabled
              ? 'Correlation are disabled'
              : '',
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
        icon: icons.sc,
        tooltipText: `Storage Connectors ${
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
      {
        id: 'Compute',
        title: 'Compute',
      },
      {
        id: 'job',
        title: 'Jobs',
        icon: icons.jobs,
        tooltipText: `Jobs ${osName === OSNames.MAC ? '⌘' : 'Ctrl'} + 4`,
        href: getHref(routeNames.jobs.list, routeNames.project.view),
        isActive: isActive('/p/:id/jobs'),
        onClick: handleNavigateRelative(
          routeNames.jobs.list,
          routeNames.project.view,
        ),
        children: [
          {
            id: 'jobOverview',
            title: 'Overview',
            href: getHref('/', '/p/:id/jobs/:jobId/*'),
            isActive: isActive('/p/:id/jobs/:jobId/', ['new']),
            onClick: handleNavigateRelative('/', '/p/:id/jobs/:jobId/*'),
          },
          {
            id: 'jobExecutions',
            title: 'Executions',
            href: getHref('/', '/p/:id/jobs/:jobId/executions'),
            isActive: isActive('/p/:id/jobs/:jobId/executions', ['new']),
            onClick: handleNavigateRelative(
              '/executions',
              '/p/:id/jobs/:jobId/',
            ),
          },
        ],
      },
      {
        id: 'Configuration',
        title: 'Configuration',
      },
      {
        id: 'psettings',
        title: 'Project settings',
        icon: icons.settings,
        tooltipText: `Project settings ${
          osName === OSNames.MAC ? '⌘' : 'Ctrl'
        } + 5`,
        isActive: isActive('/p/:id/settings'),
        href: getHref('/settings', routeNames.project.view),
        onClick: handleNavigateRelative('/settings', routeNames.project.view),
        children: [
          {
            id: 'general',
            title: 'General',
            isActive: isActive(routeNames.settings.general),
            href: getHref('/settings/general', routeNames.project.view),
            onClick: handleNavigateRelative(
              '/settings/general',
              routeNames.project.view,
            ),
          },
          {
            id: 'python',
            title: 'Python libraries',
            isActive: isActive(routeNames.settings.python),
            href: getHref('/settings/python', routeNames.project.view),
            onClick: handleNavigateRelative(
              '/settings/python',
              routeNames.project.view,
            ),
          },
          {
            id: 'alerts',
            title: 'Alerts',
            isActive: isActive(routeNames.settings.alert),
            href: getHref('/settings/alerts', routeNames.project.view),
            onClick: handleNavigateRelative(
              '/settings/alerts',
              routeNames.project.view,
            ),
          },
          {
            id: 'integrations',
            title: 'Integrations',
            isActive: isActive(routeNames.settings.integrations),
            href: getHref('/settings/integrations', routeNames.project.view),
            onClick: handleNavigateRelative(
              '/settings/integrations',
              routeNames.project.view,
            ),
          },
        ],
      },
      {
        id: 'oldui',
        title: 'Back to current Hopsworks',
        icon: icons.back,
        tooltipText: `Back to current Hopsworks`,
        href: '/hopsworks',
        isActive: false,
        onClick: () => {
          window.location.href = '/hopsworks';
        },
      },
    ];
  }, [
    osName,
    isActive,
    getHref,
    handleNavigateRelative,
    createFgAnchorLink,
    disabledTabs.dataPreviewDisabled,
    disabledTabs.fgStatisticsDisabled,
    disabledTabs.fgCorrelationsDisabled,
    disabledTabs.tdStatisticsDisabled,
    disabledTabs.tdCorrelationsDisabled,
    createTdAnchorLink,
    location.pathname,
  ]);
};

export default useAppNavigation;
