const routeNames = {
  home: '/',

  auth: {
    login: '/login',
    register: '/register',
    profile: '/account',
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
    runningCode: 'running-code',
    api: 'api',
    splitGraph: 'split-graph',
  },

  featureGroup: {
    list: '/fg',
    overview: '/fg/:fgId/*',
    edit: '/fg/:fgId/edit',
    create: '/fg/new',
    activity: '/fg/:fgId/activity',
    preview: '/fg/:fgId/data-preview',
    previewOne: '/fg/:fgId/data-preview/:featureName',
    statistics: '/fg/:fgId/statistics',
    statisticsViewOne: '/fg/:fgId/statistics/f/:featureName',
    statisticsViewCommit: '/fg/:fgId/statistics/commit/:commitTime',
    statisticsViewCommitAndOne:
      '/fg/:fgId/statistics/commit/:commitTime/f/:featureName',
    dataCorrelation: '/fg/:fgId/data/correlation',
    correlation: '/fg/:fgId/data/correlation',
  },

  trainingDataset: {
    list: '/td',
    overview: '/td/:tdId',
    edit: '/td/:tdId/edit',
    create: '/td/new',
    activity: '/td/:tdId/activity',
    statistics: '/td/:tdId/statistics',
    statisticsViewOne: '/td/:tdId/statistics/f/:featureName',
    statisticsViewCommit: '/td/:tdId/statistics/commit/:commitTime',
    statisticsViewCommitAndOne:
      '/td/:tdId/statistics/commit/:commitTime/f/:featureName',
    correlation: '/td/:tdId/data/correlation',
  },

  source: {
    list: '/sources',
    create: '/sources/new/',
    edit: '/sources/:sourceId/:connectorType/edit',
    importSample: '/sources/import-sample',
    createWithProtocol: '/sources/new/:protocol',
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
