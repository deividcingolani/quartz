import { createModel } from '@rematch/core';

// Types
import { SearchTypes } from '../../../pages/search/types';
import { TrainingDataset } from '../../../types/training-dataset';
import { Feature, FeatureGroup } from '../../../types/feature-group';
// Services
import SearchService, {
  ServerResponseData,
} from '../../../services/search/SearchService';
import FeatureGroupsService from '../../../services/project/FeatureGroupsService';
import TrainingDatasetService from '../../../services/project/TrainingDatasetService';
import FeatureGroupLabelsService from '../../../services/project/FeatureGroupLabelsService';
import { TrainingDatasetLabelService } from '../../../services/project';

export type SearchCountState = {
  featureGroups: FeatureGroup[];
  trainingDatasets: TrainingDataset[];
  features: Feature[];
};

export type DeepSearchState = {
  featureGroups: FeatureGroup[];
  trainingDatasets: TrainingDataset[];
  features: Feature[];
  searchCount?: SearchCountState;
};

export const getValidPromisesValues = (promises: any) =>
  promises.reduce(
    (acc: any, p: any) => (p.status === 'fulfilled' ? [...acc, p.value] : acc),
    [],
  );

const getModified = (data: any) => {
  return Object.keys(data).reduce((acc, key) => {
    const k = key as keyof any;
    if (data[k].length > 0) acc[k] = data[k];
    return acc;
  }, {} as any);
};

const getFullData = async (
  data: ServerResponseData,
): Promise<DeepSearchState> => {
  const { featuregroups, features, trainingdatasets } = data;

  const featuresPromises = await Promise.allSettled(
    features.map(async (feature) => {
      const [fullFeatureGroup] = await FeatureGroupsService.getByName(
        feature.parentProjectId,
        feature.featurestoreId,
        (feature.featuregroup as unknown) as string,
        feature.version,
      );

      return {
        ...fullFeatureGroup,
        ...feature,
      };
    }),
  );

  const featureGroupsPromises = await Promise.allSettled(
    featuregroups.map(async (fg) => {
      const [fullFeatureGroup] = await FeatureGroupsService.getByName(
        fg.parentProjectId,
        fg.featurestoreId,
        fg.name,
        fg.version,
      );
      return {
        ...{
          ...fg,
        },
        ...fullFeatureGroup,
      };
    }),
  );

  const trainingDatasetsPromises = await Promise.allSettled(
    trainingdatasets.map(async (td) => {
      const [fullTrainingDataset] = await TrainingDatasetService.getByName(
        td.parentProjectId,
        td.featurestoreId,
        td.name,
        td.version,
      );
      return {
        ...{
          ...td,
        },
        ...fullTrainingDataset,
      };
    }),
  );

  const mappedFeatures = getValidPromisesValues(featuresPromises);
  const mappedFeatureGroups = getValidPromisesValues(featureGroupsPromises);
  const mappedTrainingDatasets = getValidPromisesValues(
    trainingDatasetsPromises,
  );

  return getModified({
    featureGroups: mappedFeatureGroups,
    trainingDatasets: mappedTrainingDatasets,
    features: mappedFeatures,
  });
};

const deepSearch = createModel()({
  state: {
    features: [],
    featureGroups: [],
    trainingDatasets: [],
    searchCount: {} as SearchCountState,
  } as DeepSearchState,
  reducers: {
    setData: (_: DeepSearchState, payload: DeepSearchState): DeepSearchState =>
      payload,
    addData: (
      state: DeepSearchState,
      payload: DeepSearchState,
    ): DeepSearchState => ({ ...state, ...payload }),
    clear: () => ({
      features: [],
      featureGroups: [],
      trainingDatasets: [],
      searchCount: {} as SearchCountState,
    }),
  },
  effects: (dispatch) => ({
    fetchType: async ({
      type,
      search,
      projectId,
    }: {
      type: SearchTypes;
      search: string;
      projectId: number;
    }): Promise<void> => {
      const data = await SearchService.getType(search, type);
      const mappedData = await getFullData(data);
      dispatch.deepSearch.addData(mappedData);
      dispatch.deepSearch.fetchKeywordsAndLastUpdate({
        type,
        data: mappedData,
        projectId,
      });
    },
    fetchTypeFromProject: async ({
      type,
      search,
      projectId,
    }: {
      type: SearchTypes;
      search: string;
      projectId: number;
    }): Promise<void> => {
      const data = await SearchService.getTypeFromProject(
        projectId,
        search,
        type,
      );
      const mappedData = await getFullData(data);
      dispatch.deepSearch.addData(mappedData);
      dispatch.deepSearch.fetchKeywordsAndLastUpdate({
        type,
        data: mappedData,
        projectId,
      });
    },
    fetchCountFromProject: async ({
      search,
      projectId,
    }: {
      search: string;
      projectId: number;
    }): Promise<void> => {
      dispatch.deepSearch.clear();
      const data = await SearchService.getAllFromProject(projectId, search);
      dispatch.deepSearch.addData({ searchCount: data });
    },
    fetchCount: async ({ search }: { search: string }): Promise<void> => {
      dispatch.deepSearch.clear();
      const data = await SearchService.getAll(search);
      dispatch.deepSearch.addData({ searchCount: data });
    },
    fetchKeywordsAndLastUpdate: async ({
      type,
      data,
      projectId,
    }: {
      type: SearchTypes;
      data: DeepSearchState;
      projectId: number;
    }): Promise<void> => {
      if (type === SearchTypes.feature) return;

      const typesMap: any = {
        [SearchTypes.td]: {
          target: 'trainingDatasets',
          dataset: data.trainingDatasets || [],
          writeLastService: TrainingDatasetService,
          labelsService: new TrainingDatasetLabelService(),
        },
        [SearchTypes.fg]: {
          target: 'featureGroups',
          dataset: data.featureGroups || [],
          writeLastService: FeatureGroupsService,
          labelsService: FeatureGroupLabelsService,
        },
      };
      const actions = typesMap[type as keyof any];

      const promises = await Promise.allSettled(
        actions.dataset.map(async (data: TrainingDataset | FeatureGroup) => {
          const readLast = await actions.writeLastService.getWriteLast(
            projectId || data.parentProjectId,
            data.featurestoreId,
            data.id,
          );

          const keywords = await actions.labelsService.getList(
            projectId || data.parentProjectId,
            data.featurestoreId,
            data.id,
          );
          return {
            ...data,
            labels: keywords,
            labelsData: keywords,
            test: [],
            updated: readLast || data.created,
          };
        }),
      );
      const datasets = getValidPromisesValues(promises);
      const result = { ...{ [actions.target]: datasets } };
      dispatch.deepSearch.addData(result);
    },
  }),
});

export default deepSearch;
