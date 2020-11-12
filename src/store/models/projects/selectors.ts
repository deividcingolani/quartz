import { Project } from '../../../types/project';
import { RootState } from '../../index';
import { ProjectsState } from './projectsList.model';

export const projectsList = ({
  projectsList: list,
  loading,
}: RootState): { projects: ProjectsState; isLoading: boolean } => ({
  projects: list,
  isLoading: loading.effects.projectsList.getProjects,
});

export const selectedProject = ({
  projectsList: list,
  selectedProject: selected,
}: RootState): Project | undefined => list.find(({ id }) => id === selected);
