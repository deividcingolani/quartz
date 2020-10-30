const routeNames = {
  home: '/',

  project: {
    view: 'p/:id/*',
    list: '/',
    edit: 'p/:id/edit',
    create: 'p/new',
  },

  featureGroup: {
    list: '/fg',
    overview: '/fg/:fgId/*',
    overviewAnchors: {
      featureList: 'feature-list',
      schematisedTags: 'schematised-tags',
      pipelineHistory: 'pipeline-history',
      runningCode: 'running-code',
      api: 'api',
    },
    edit: '/fg/:fgId/edit',
    create: '/fg/new',
    activity: '/fg/:fgId/activity',
    dataPreview: '/fg/:fgId/data/preview',
    statistics: '/fg/:fgId/statistics/:featureId',
    dataCorrelation: '/fg/:fgId/data/correlation',
  },

  trainingDatasetList: '/td',
  trainingDatasetEdit: '/td/:id/edit',
};

export default routeNames;
