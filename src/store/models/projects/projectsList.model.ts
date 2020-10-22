import { createModel } from '@rematch/core';
import ProjectsService from '../../../services/project/ProjectsService';
import { Project } from '../../../types/project';

export type ProjectsState = Project[];

const projectsList = createModel()({
  state: [] as ProjectsState,
  reducers: {
    setProjects: (_: ProjectsState, payload: Project[]): ProjectsState =>
      payload,
  },
  effects: (dispatch) => ({
    getProjects: async (): Promise<void> => {
      dispatch.projectsList.setProjects(await ProjectsService.getList());
    },
  }),
});

export default projectsList;
