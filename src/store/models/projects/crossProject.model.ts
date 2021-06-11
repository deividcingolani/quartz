import { createModel } from '@rematch/core';
import { CrossUserProject } from '../../../types/project';
import CrossProjectsService from '../../../services/project/CrossProjectsService';

export type CrossProjectState = CrossUserProject;

const crossProject = createModel()({
  state: {} as CrossUserProject,
  reducers: {
    setProject: (_: CrossProjectState, payload: CrossUserProject): CrossProjectState =>
      payload,
  },
  effects: (dispatch) => ({
    getCrossUserProject: async (id: number): Promise<void> => {
      const projects = await CrossProjectsService.getAllAcrossUsers();
      const project = projects.find((x: CrossUserProject) => x.id === id);
      dispatch.crossProject.setProject(project || null);
    },
  }),
});

export default crossProject;
