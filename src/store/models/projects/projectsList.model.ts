import { createModel } from '@rematch/core';
import ProjectsService from '../../../services/project/ProjectsService';
import { Project } from '../../../types/project';

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
      dispatch.projectsList.setProjects(projects);
      return projects;
    },
  }),
});

export default projectsList;
