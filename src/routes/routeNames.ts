const routeNames = {
  home: '/',

  auth: {
    login: '/login',
    register: '/register',
    recover: '/forgot',
  },

  expectation: {
    attach: '/expectation/attach/:fgId/*',
    edit: '/expectation/:expName',
    editWithFrom: '/expectation/:expName/:from',
  },

  account: {
    view: '/account/*',
    api: {
      list: '/account/api',
      create: '/account/api/new',
      edit: '/account/api/:name/edit',
    },
    secrets: {
      list: '/account/secrets',
      create: '/account/secrets/new',
    },
    profile: '/account/profile',
    auth: '/account/authentication',
  },

  project: {
    view: 'p/:id/*',
    viewHome: 'p/:id/view',
    list: '/',
    edit: 'p/:id/edit',
    create: 'p/new',
  },

  overviewAnchors: {
    featureList: 'feature-list',
    provenance: 'provenance',
    schematisedTags: 'schematised-tags',
    pipelineHistory: 'pipeline-history',
    api: 'api',
    splitGraph: 'split-graph',
    expectations: 'expectations',
    executions: 'executions',
    code: 'code',
    databricks: 'databricks',
    spark: 'spark',
  },

  featureGroup: {
    list: '/fs/:fsId/fg',
    overview: '/fs/:fsId/fg/:fgId/*',
    edit: '/fs/:fsId/fg/:fgId/edit',
    create: '/fs/:fsId/fg/new',
    activity: '/fs/:fsId/fg/:fgId/activity',
    activityType: '/fs/:fsId/fg/:fgId/activity/:type',
    activityTypeAndFromAndTo: '/fs/:fsId/fg/:fgId/activity/:type/:from/:to',
    activityFromAndTo: '/fs/:fsId/fg/:fgId/activity/:from/:to',
    preview: '/fs/:fsId/fg/:fgId/data-preview',
    previewOne: '/fs/:fsId/fg/:fgId/data-preview/:featureName',
    statistics: '/fs/:fsId/fg/:fgId/statistics',
    statisticsViewOne: '/fs/:fsId/fg/:fgId/statistics/f/:featureName',
    statisticsViewCommit: '/fs/:fsId/fg/:fgId/statistics/commit/:commitTime',
    statisticsViewCommitAndOne:
      '/fs/:fsId/fg/:fgId/statistics/commit/:commitTime/f/:featureName',
    correlation: '/fs/:fsId/fg/:fgId/correlation',
  },

  trainingDataset: {
    list: '/fs/:fsId/td',
    overview: '/fs/:fsId/td/:tdId',
    edit: '/fs/:fsId/td/:tdId/edit',
    create: '/fs/:fsId/td/new',
    statistics: '/fs/:fsId/td/:tdId/statistics',
    statisticsViewOne: '/fs/:fsId/td/:tdId/statistics/f/:featureName',
    statisticsViewCommit: '/fs/:fsId/td/:tdId/statistics/commit/:commitTime',
    statisticsViewCommitSplit:
      '/fs/:fsId/td/:tdId/statistics/commit/:commitTime/split/:split',
    statisticsViewCommitAndOne:
      '/fs/:fsId/td/:tdId/statistics/commit/:commitTime/f/:featureName',
    statisticsViewCommitSplitAndOne:
      '/fs/:fsId/td/:tdId/statistics/commit/:commitTime/split/:split/f/:featureName',
    correlation: '/fs/:fsId/td/:tdId/correlation',
    correlationViewCommit: '/fs/:fsId/td/:tdId/correlation/commit/:commitTime',
    correlationViewCommitSplit:
      '/fs/:fsId/td/:tdId/correlation/commit/:commitTime/split/:split',
    activity: '/fs/:fsId/td/:tdId/activity',
    activityType: '/fs/:fsId/td/:tdId/activity/:type',
    activityTypeAndFromAndTo: '/fs/:fsId/td/:tdId/activity/:type/:from/:to',
    activityFromAndTo: '/fs/:fsId/td/:tdId/activity/:from/:to',
  },

  storageConnector: {
    list: '/fs/:fsId/storage-connectors',
    create: '/fs/:fsId/storage-connectors/new/',
    edit: '/fs/:fsId/storage-connectors/:connectorName/edit',
    importSample: '/fs/:fsId/storage-connectors/import-sample',
    createWithProtocol: '/fs/:fsId/storage-connectors/new/:protocol',
  },

  jobs: {
    list: '/jobs',
    overview: '/jobs/:jobId',
    edit: '/jobs/:jobId/edit',
    create: '/jobs/new',
    executions: '/jobs/:jobId/executions',
    executionsType: '/jobs/:jobId/executions/:type',
    executionsFromAndTo: '/jobs/:jobId/executions/:from/:to',
    executionsTypeAndFromAndTo: '/jobs/:jobId/executions/:type/:from/:to',
  },

  settings: {
    view: 'settings/*',
    general: 'p/:id/settings/general',
    python: 'p/:id/settings/python',
    alert: 'p/:id/settings/alert',
    integrations: 'p/:id/settings/integrations',
    schematisedTags: {
      list: 'settings/schematised-tags',
      create: 'settings/schematised-tags/new',
    },
  },

  search: {
    view: 'search/*',
    searchAllProjectsFeatures: 'features/:searchText',
    searchOneProjectFeatures: 'p/:id/features/:searchText',
    searchAllProjectsFeaturesWithoutSearch: 'features',
    searchOneProjectFeaturesWithoutSearch: 'p/:id/features/',

    searchAllProjectsFeatureGroups: 'fg/:searchText',
    searchOneProjectFeatureGroups: 'p/:id/fg/:searchText',
    searchAllProjectsFeatureGroupsWithoutSearch: 'fg',
    searchOneProjectFeatureGroupsWithoutSearch: 'p/:id/fg/',

    searchAllProjectsTrainingDatasets: 'td/:searchText',
    searchOneProjectTrainingDatasets: 'p/:id/td/:searchText',
    searchAllProjectsTrainingDatasetsWithoutSearch: 'td',
    searchOneProjectTrainingDatasetsWithoutSearch: 'p/:id/td/',
  },
};

export default routeNames;
