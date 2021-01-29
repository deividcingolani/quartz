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

export const selectIsRefetchingProject = (state: RootState) =>
  state.loading.effects.project.refetchProject;

export const selectMembers = (state: RootState) => state.members;

export const selectIsDeletingMember = (state: RootState) =>
  state.loading.effects.members.delete;

export const selectIsEditingMember = (state: RootState) =>
  state.loading.effects.members.edit;

export const selectIsAddingMember = (state: RootState) =>
  state.loading.effects.members.add;
