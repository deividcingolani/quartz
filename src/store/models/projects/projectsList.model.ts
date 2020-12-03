import { createModel } from '@rematch/core';
import ProjectsService from '../../../services/project/ProjectsService';
import { Project } from '../../../types/project';
import FeatureStoresService from '../../../services/project/FeatureStoresService';

export type ProjectsState = Project[];

const projectsList = createModel()({
  state: [] as ProjectsState,
  reducers: {
    setProjects: (_: ProjectsState, payload: Project[]): ProjectsState =>
      payload,
    clear: () => [],
  },
  effects: (dispatch) => ({
    getProjects: async (): Promise<Project[]> => {
      const projects = await ProjectsService.getList();

      const projectsPromises = await Promise.allSettled(
        projects.map(async (project) => {
          const [featureStore] = await FeatureStoresService.getList(project.id);

          return {
            ...project,
            featureGroupsCount: featureStore.numFeatureGroups,
            trainingDatasetsCount: featureStore.numTrainingDatasets,
          };
        }),
      );

      const mappedProjects = projectsPromises.reduce(
        (acc: Project[], next) =>
          next.status === 'fulfilled' ? [...acc, next.value] : acc,
        [],
      );

      dispatch.projectsList.setProjects(mappedProjects);
      return projects;
    },
  }),
});

export default projectsList;
