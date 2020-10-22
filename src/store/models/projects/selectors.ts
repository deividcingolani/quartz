import { Project } from '../../../types/project';
import { RootState } from '../../index';
import { ProjectsState } from './projectsList.model';

export const projectsList = ({
  projectsList: list,
}: RootState): ProjectsState => list;

export const selectedProject = ({
  projectsList: list,
  selectedProject: selected,
}: RootState): Project | undefined => list.find(({ id }) => id === selected);
