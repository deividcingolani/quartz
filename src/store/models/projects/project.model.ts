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
        featureGroupsCount: featureStore.numFeatureGroups,
        trainingDatasetsCount: featureStore.numTrainingDatasets,
      };

      dispatch.project.setProject(mappedProject);
    },
    refetchProject: async (id: number): Promise<void> => {
      const project = await ProjectsService.get(id);

      const [featureStore] = await FeatureStoresService.getList(id);

      const mappedProject = {
        ...project,
        featureGroupsCount: featureStore.numFeatureGroups,
        trainingDatasetsCount: featureStore.numTrainingDatasets,
      };

      dispatch.project.setProject(mappedProject);
    },
    create: async ({ data }: { data: any }): Promise<any> => {
      return await ProjectsService.create(data);
    },
    edit: async ({ id, data }: { id: number; data: any }): Promise<any> => {
      return await ProjectsService.edit(id, data);
    },
    delete: async ({ id }: { id: number }): Promise<any> => {
      return await ProjectsService.delete(id);
    },
  }),
});

export default project;
