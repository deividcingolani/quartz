import { useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo } from 'react';

import {
  matchPath,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { TreeNode } from '@logicalclocks/quartz';

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
import getHrefNoMatching from '../../../utils/getHrefNoMatching';

const useAppNavigation = (): TreeNode[] => {
  const location = useLocation();
  const fgOverviewAnchors = useAnchor('fgOverview');
  const tdOverviewAnchors = useAnchor('tdOverview');
  const navigateRelative = useNavigateRelative();
  const navigate = useNavigate();
  const { id } = useParams();

  const featurestore = useSelector((state: RootState) =>
    state.featureStores?.length ? state.featureStores[0] : null,
  );

  const handleShortcut = useCallback(
    (e) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        ['0', '1', '2', '3', '4', '5', '6'].includes(e.key)
      ) {
        switch (e.key) {
          case '0': {
            navigate(
              getHrefNoMatching(routeNames.project.viewHome, '', true, { id }),
            );
            break;
          }
          case '1': {
            navigate(
              getHrefNoMatching(
                routeNames.featureGroup.list,
                routeNames.project.value,
                true,
                { id, fsId: featurestore?.featurestoreId },
              ),
            );

            break;
          }
          case '2': {
            navigate(
              getHrefNoMatching(
                routeNames.trainingDataset.list,
                routeNames.project.value,
                true,
                { id, fsId: featurestore?.featurestoreId },
              ),
            );

            break;
          }
          case '3': {
            navigate(
              getHrefNoMatching(
                routeNames.storageConnector.list,
                routeNames.project.value,
                true,
                { id, fsId: featurestore?.featurestoreId },
              ),
            );

            break;
          }
          case '4': {
            navigate(
              getHrefNoMatching(
                routeNames.jupyter.overview,
                routeNames.project.value,
                true,
                { id },
              ),
            );
            break;
          }
          case '5': {
            navigate(
              getHrefNoMatching(
                routeNames.jobs.list,
                routeNames.project.value,
                true,
                { id },
              ),
            );
            break;
          }
          case '6': {
            navigate(
              getHrefNoMatching(
                routeNames.project.settings.general,
                routeNames.project.value,
                true,
                { id },
              ),
            );
            break;
          }
          default:
          // Do nothing
        }

        e.preventDefault();
      }
    },
    [id, navigate, featurestore?.featurestoreId],
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

  const handleNavigate = useCallback(
    (to: string) => (): void => navigate(to),
    [navigate],
  );

  const handleNavigateMultiStore = useCallback(
    (to: string, relativeTo: string) => (): void => {
      if (featurestore?.featurestoreId) {
        navigateRelative(
          to.replace(':fsId', String(featurestore?.featurestoreId)),
          relativeTo,
        );
      }
    },
    [featurestore?.featurestoreId, navigateRelative],
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
        mainTooltipText: 'Home',
        secondaryTooltipText: `${osName === OSNames.MAC ? '⌘' : 'Ctrl'} + 0`,
        isActive: isActive('/p/:id/view'),
        href: getHref('/view', routeNames.project.view),
        onClick: handleNavigateRelative('/view', routeNames.project.view),
      },
      { id: 'Feature Store', title: 'Feature Store' },
      {
        id: 'fg',
        title: 'Feature Groups',
        mainTooltipText: 'Feature Groups',
        secondaryTooltipText: `${osName === OSNames.MAC ? '⌘' : 'Ctrl'} + 1`,
        icon: icons.fg,
        onClick: handleNavigateMultiStore(
          routeNames.featureGroup.list,
          routeNames.project.view,
        ),
        href: getHref(routeNames.featureGroup.list, routeNames.project.view),
        isActive: isActive([
          '/p/:id/fs/:fsId/fg',
          '/p/:id/fs/:fsId/expectation/attach/:fgId',
          '/p/:id/fs/:fsId/expectation/:expId',
        ]),
        children: [
          {
            id: 'fgOverview',
            title: 'Overview',
            href: getHref('/', '/p/:id/fs/:fsId/fg/:fgId/*'),
            isActive: isActive('/p/:id/fs/:fsId/fg/:fgId', ['new']),
            onClick: handleNavigateRelative('/', '/p/:id/fs/:fsId/fg/:fgId/*'),
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
            href: getHref('/data-preview', '/p/:id/fs/:fsId/fg/:fgId/*'),
            disabled: disabledTabs.dataPreviewDisabled,
            isActive: isActive('p/:id/fs/:fsId/fg/:fgId/data-preview/*'),
            onClick: handleNavigateRelative(
              '/data-preview',
              '/p/:id/fs/:fsId/fg/:fgId/*',
            ),
          },
          {
            id: 'fgStats',
            title: 'Feature statistics',
            secondaryTooltipText: disabledTabs.fgStatisticsDisabled
              ? 'Statistics are disabled'
              : '',
            href: getHref('/statistics', '/p/:id/fs/:fsId/fg/:fgId/*'),
            disabled: disabledTabs.fgStatisticsDisabled,
            isActive: isActive('/p/:id/fs/:fsId/fg/:fgId/statistics/*'),
            onClick: handleNavigateRelative(
              '/statistics',
              '/p/:id/fs/:fsId/fg/:fgId/*',
            ),
          },
          {
            id: 'fgCorrelation',
            title: 'Feature correlations',
            href: getHref('/correlation', '/p/:id/fs/:fsId/fg/:fgId/*'),
            disabled: disabledTabs.fgCorrelationsDisabled,
            isActive: isActive('/p/:id/fs/:fsId/fg/:fgId/correlation/*'),
            onClick: handleNavigateRelative(
              '/correlation',
              '/p/:id/fs/:fsId/fg/:fgId/*',
            ),
            secondaryTooltipText: disabledTabs.fgCorrelationsDisabled
              ? 'Correlation are disabled'
              : '',
          },
          {
            id: 'fgActivity',
            title: 'Activity',
            href: getHref('/activity', '/p/:id/fs/:fsId/fg/:fgId/*'),
            onClick: handleNavigateRelative(
              '/activity',
              '/p/:id/fs/:fsId/fg/:fgId/*',
            ),
            isActive: isActive([
              '/p/:id/fs/:fsId/fg/:fgId/activity',
              '/p/:id/fs/:fsId/fg/:fgId/activity/:type',
              '/p/:id/fs/:fsId/fg/:fgId/activity/:type/:from/:to',
              '/p/:id/fs/:fsId/fg/:fgId/activity/:from/:to',
            ]),
          },
        ],
      },
      {
        id: 'td',
        title: 'Training Datasets',
        mainTooltipText: 'Training Datasets',
        secondaryTooltipText: `${osName === OSNames.MAC ? '⌘' : 'Ctrl'} + 2`,
        icon: icons.td,
        isActive: isActive('/p/:id/fs/:fsId/td'),
        href: getHref(routeNames.trainingDataset.list, routeNames.project.view),
        onClick: handleNavigateMultiStore(
          routeNames.trainingDataset.list,
          routeNames.project.view,
        ),
        children: [
          {
            id: 'tdOverview',
            title: 'Overview',
            href: getHref('/', '/p/:id/fs/:fsId/td/:tdId/*'),
            isActive: isActive('/p/:id/fs/:fsId/td/:tdId', ['new']),
            onClick: handleNavigateRelative('/', '/p/:id/fs/:fsId/td/:tdId/*'),
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
            href: getHref('/statistics', '/p/:id/fs/:fsId/td/:tdId/*'),
            title: 'Feature statistics',
            disabled: disabledTabs.tdStatisticsDisabled,
            isActive: isActive('/p/:id/fs/:fsId/td/:tdId/statistics/*'),
            onClick: handleNavigateRelative(
              '/statistics',
              '/p/:id/fs/:fsId/td/:tdId/*',
            ),
            secondaryTooltipText: disabledTabs.tdStatisticsDisabled
              ? 'Statistics are disabled'
              : '',
          },
          {
            id: 'tdCorrelation',
            title: 'Feature correlations',
            href: getHref('/correlation', '/p/:id/fs/:fsId/td/:tdId/*'),
            disabled: disabledTabs.tdCorrelationsDisabled,
            isActive: isActive(routeNames.trainingDataset.correlation),
            onClick: handleNavigateRelative(
              '/correlation',
              '/p/:id/fs/:fsId/td/:tdId/*',
            ),
            secondaryTooltipText: disabledTabs.tdCorrelationsDisabled
              ? 'Correlation are disabled'
              : '',
          },
          {
            id: 'tdActivity',
            title: 'Activity',
            href: getHref('/activity', '/p/:id/fs/:fsId/td/:tdId/*'),
            onClick: handleNavigateRelative(
              '/activity',
              '/p/:id/fs/:fsId/td/:tdId/*',
            ),
            isActive: isActive('/p/:id/fs/:fsId/td/:tdId/activity'),
          },
        ],
      },
      {
        id: 'sc',
        title: 'Storage Connectors',
        icon: icons.sc,
        mainTooltipText: 'Storage Connectors',
        secondaryTooltipText: `${osName === OSNames.MAC ? '⌘' : 'Ctrl'} + 3`,
        href: getHref(
          routeNames.storageConnector.list,
          routeNames.project.view,
        ),
        isActive: isActive('/p/:id/fs/:fsId/storage-connectors'),
        onClick: handleNavigateMultiStore(
          routeNames.storageConnector.list,
          routeNames.project.view,
        ),
      },
      {
        id: 'Compute',
        title: 'Compute',
      },
      {
        id: 'jupyter',
        title: 'Jupyter',
        icon: icons.jupyter,
        tooltipText: `Jupyter ${osName === OSNames.MAC ? '⌘' : 'Ctrl'} + 4`,
        href: getHref(routeNames.jupyter.overview, routeNames.project.view),
        isActive: isActive('/p/:id/jupyter/*'),
        onClick: handleNavigateRelative(
          routeNames.jupyter.overview,
          routeNames.project.view,
        ),
      },
      {
        id: 'job',
        title: 'Jobs',
        icon: icons.jobs,
        mainTooltipText: 'Jobs',
        secondaryTooltipText: `${osName === OSNames.MAC ? '⌘' : 'Ctrl'} + 5`,
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
        mainTooltipText: 'Project settings',
        secondaryTooltipText: `${osName === OSNames.MAC ? '⌘' : 'Ctrl'} + 6`,
        isActive: isActive(
          getHrefNoMatching(
            routeNames.project.settings.settings,
            routeNames.project.value,
            true,
          ),
        ),
        href: getHrefNoMatching(
          routeNames.project.settings.settings,
          routeNames.project.value,
          true,
          { id },
        ),
        onClick: handleNavigate(
          getHrefNoMatching(
            routeNames.project.settings.settings,
            routeNames.project.value,
            true,
            { id },
          ),
        ),
        children: [
          {
            id: 'general',
            title: 'General',
            isActive: isActive(
              getHrefNoMatching(
                routeNames.project.settings.general,
                routeNames.project.value,
                true,
              ),
            ),
            href: getHrefNoMatching(
              routeNames.project.settings.general,
              routeNames.project.value,
              true,
              { id },
            ),
            onClick: handleNavigate(
              getHrefNoMatching(
                routeNames.project.settings.general,
                routeNames.project.value,
                true,
                { id },
              ),
            ),
          },
          {
            id: 'python',
            title: 'Python libraries',
            isActive: isActive(
              getHrefNoMatching(
                routeNames.project.settings.python,
                routeNames.project.value,
                true,
              ),
            ),
            href: getHrefNoMatching(
              routeNames.project.settings.python,
              routeNames.project.value,
              true,
              { id },
            ),
            onClick: handleNavigate(
              getHrefNoMatching(
                routeNames.project.settings.python,
                routeNames.project.value,
                true,
                { id },
              ),
            ),
          },
          {
            id: 'alerts',
            title: 'Alerts',
            isActive: isActive(
              getHrefNoMatching(
                routeNames.project.settings.alert,
                routeNames.project.value,
                true,
              ),
            ),
            href: getHrefNoMatching(
              routeNames.project.settings.alert,
              routeNames.project.value,
              true,
              { id },
            ),
            onClick: handleNavigate(
              getHrefNoMatching(
                routeNames.project.settings.alert,
                routeNames.project.value,
                true,
                { id },
              ),
            ),
          },
          {
            id: 'integrations',
            title: 'Integrations',
            isActive: isActive(
              getHrefNoMatching(
                routeNames.project.settings.integrations,
                routeNames.project.value,
                true,
              ),
            ),
            href: getHrefNoMatching(
              routeNames.project.settings.integrations,
              routeNames.project.value,
              true,
              { id },
            ),
            onClick: handleNavigate(
              getHrefNoMatching(
                routeNames.project.settings.integrations,
                routeNames.project.value,
                true,
                { id },
              ),
            ),
          },
        ],
      },
      {
        id: 'oldui',
        title: 'Back to current Hopsworks',
        icon: icons.back,
        mainTooltipText: `Back to current Hopsworks`,
        href: '/hopsworks',
        isActive: false,
        onClick: () => {
          window.location.href = '/hopsworks';
        },
      },
    ];
  }, [
    id,
    osName,
    isActive,
    getHref,
    handleNavigateRelative,
    handleNavigate,
    createFgAnchorLink,
    disabledTabs.dataPreviewDisabled,
    disabledTabs.fgStatisticsDisabled,
    disabledTabs.fgCorrelationsDisabled,
    disabledTabs.tdStatisticsDisabled,
    disabledTabs.tdCorrelationsDisabled,
    createTdAnchorLink,
    handleNavigateMultiStore,
  ]);
};

export default useAppNavigation;
