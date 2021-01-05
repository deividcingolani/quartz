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
import { TrainingDatasetLabelService } from '../../../services/project/training-dataset-labels.service';

export type DeepSearchState = {
  featureGroups: FeatureGroup[];
  trainingDatasets: TrainingDataset[];
  features: Feature[];
};

const getValidPromisesValues = (promises: any) =>
  promises.reduce(
    (acc: any, p: any) => (p.status === 'fulfilled' ? [...acc, p.value] : acc),
    [],
  );

const getFullData = async (
  data: ServerResponseData,
): Promise<DeepSearchState> => {
  const { featuregroups, features, trainingdatasets } = data;

  const featuresPromises = await Promise.allSettled(
    features.map(async (feature) => {
      const [fullFeatureGroup] = await FeatureGroupsService.getByName(
        feature.parentProjectId,
        feature.featurestoreId,
        feature.featuregroup,
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

      let keywords: string[] = [];
      if (fullFeatureGroup.type === 'cachedFeaturegroupDTO') {
        keywords = await FeatureGroupLabelsService.getList(
          fg.parentProjectId,
          fg.featurestoreId,
          fullFeatureGroup.id,
        );
      }

      return {
        ...{ ...fg, labels: keywords },
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

      const {
        data: { keywords },
      } = await new TrainingDatasetLabelService().getKeywords(
        td.parentProjectId,
        td.featurestoreId,
        fullTrainingDataset.id,
      );

      return {
        ...{ ...td, labels: keywords },
        ...fullTrainingDataset,
      };
    }),
  );

  const mappedFeatures = getValidPromisesValues(featuresPromises);
  const mappedFeatureGroups = getValidPromisesValues(featureGroupsPromises);
  const mappedTrainingDatasets = getValidPromisesValues(
    trainingDatasetsPromises,
  );

  return {
    featureGroups: mappedFeatureGroups,
    trainingDatasets: mappedTrainingDatasets,
    features: mappedFeatures,
  };
};

const deepSearch = createModel()({
  state: {
    features: [],
    featureGroups: [],
    trainingDatasets: [],
  } as DeepSearchState,
  reducers: {
    setData: (_: DeepSearchState, payload: DeepSearchState): DeepSearchState =>
      payload,
    clear: () => ({
      features: [],
      featureGroups: [],
      trainingDatasets: [],
    }),
  },
  effects: (dispatch) => ({
    fetchAll: async ({ search }: { search: string }): Promise<void> => {
      const data = await SearchService.getAll(search);

      const mappedData = await getFullData(data);

      dispatch.deepSearch.setData(mappedData);
    },

    fetchType: async ({
      search,
      type,
    }: {
      search: string;
      type: SearchTypes;
    }): Promise<void> => {
      const data = await SearchService.getType(search, type);

      const mappedData = await getFullData(data);

      dispatch.deepSearch.setData(mappedData);
    },

    fetchAllPromProject: async ({
      search,
      projectId,
    }: {
      search: string;
      projectId: number;
    }): Promise<void> => {
      const data = await SearchService.getAllFromProject(projectId, search);

      const mappedData = await getFullData(data);

      dispatch.deepSearch.setData(mappedData);
    },

    fetchTypePromProject: async ({
      type,
      search,
      projectId,
    }: {
      search: string;
      projectId: number;
      type: SearchTypes;
    }): Promise<void> => {
      const data = await SearchService.getTypeFromProject(
        projectId,
        search,
        type,
      );

      const mappedData = await getFullData(data);

      dispatch.deepSearch.setData(mappedData);
    },
  }),
});

export default deepSearch;
