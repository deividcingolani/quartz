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
    integrations: {
      code: 'p/:id/integrations/code',
      databricks: 'p/:id/integrations/databricks',
      spark: 'p/:id/integrations/spark',
    },
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
  },

  featureGroup: {
    list: '/fg',
    overview: '/fg/:fgId/*',
    edit: '/fg/:fgId/edit',
    create: '/fg/new',
    activity: '/fg/:fgId/activity',
    activityType: '/fg/:fgId/activity/:type',
    activityTypeAndFromAndTo: '/fg/:fgId/activity/:type/:from/:to',
    activityFromAndTo: '/fg/:fgId/activity/:from/:to',
    preview: '/fg/:fgId/data-preview',
    previewOne: '/fg/:fgId/data-preview/:featureName',
    statistics: '/fg/:fgId/statistics',
    statisticsViewOne: '/fg/:fgId/statistics/f/:featureName',
    statisticsViewCommit: '/fg/:fgId/statistics/commit/:commitTime',
    statisticsViewCommitAndOne:
      '/fg/:fgId/statistics/commit/:commitTime/f/:featureName',
    correlation: '/fg/:fgId/correlation',
  },

  trainingDataset: {
    list: '/td',
    overview: '/td/:tdId',
    edit: '/td/:tdId/edit',
    create: '/td/new',
    statistics: '/td/:tdId/statistics',
    statisticsViewOne: '/td/:tdId/statistics/f/:featureName',
    statisticsViewCommit: '/td/:tdId/statistics/commit/:commitTime',
    statisticsViewCommitAndOne:
      '/td/:tdId/statistics/commit/:commitTime/f/:featureName',
    correlation: '/td/:tdId/correlation',
    activity: '/td/:tdId/activity',
    activityType: '/td/:tdId/activity/:type',
    activityTypeAndFromAndTo: '/td/:tdId/activity/:type/:from/:to',
    activityFromAndTo: '/td/:tdId/activity/:from/:to',
  },

  storageConnector: {
    list: '/storage-connectors',
    create: '/storage-connectors/new/',
    edit: '/storage-connectors/:connectorName/edit',
    importSample: '/storage-connectors/import-sample',
    createWithProtocol: '/storage-connectors/new/:protocol',
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
