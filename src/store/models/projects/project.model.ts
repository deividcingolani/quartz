import { createModel } from '@rematch/core';
import ProjectsService from '../../../services/project/ProjectsService';
import { Project } from '../../../types/project';
import FeatureStoresService from '../../../services/project/FeatureStoresService';

export type ProjectState = Project;

const project = createModel()({
  state: {} as Project,
  reducers: {
    setProject: (_: ProjectState, payload: Project): ProjectState => payload,
  },
  effects: (dispatch) => ({
    getProject: async (id: number): Promise<void> => {
      const project = await ProjectsService.get(id);

      const [featureStore] = await FeatureStoresService.getList(id);

      const mappedProject = {
        ...project,
        featureGroupsCount: featureStore ? featureStore.numFeatureGroups : 0,
        trainingDatasetsCount: featureStore
          ? featureStore.numTrainingDatasets
          : 0,
      };

      dispatch.project.setProject(mappedProject);
    },
    refetchProject: async (id: number): Promise<void> => {
      const project = await ProjectsService.get(id);

      const [featureStore] = await FeatureStoresService.getList(id);

      const mappedProject = {
        ...project,
        featureGroupsCount: featureStore ? featureStore.numFeatureGroups : 0,
        trainingDatasetsCount: featureStore
          ? featureStore.numTrainingDatasets
          : 0,
      };

      dispatch.project.setProject(mappedProject);
    },
    create: async ({ data }: { data: any }): Promise<any> => {
      return ProjectsService.create(data);
    },
    edit: async ({ id, data }: { id: number; data: any }): Promise<any> => {
      return ProjectsService.edit(id, data);
    },
    delete: async ({ id }: { id: number }): Promise<any> => {
      return ProjectsService.delete(id);
    },
    createTour: async (tour: string): Promise<any> => {
      return ProjectsService.createTour(tour);
    },
  }),
});

export default project;
