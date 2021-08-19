/**
 * Retrieves the projects list from Redux and returns it in the following order:
 * Opened projects by most recent followed by unopened ones in alphabetical order.
 */
// Hook
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
// Services
import ProjectsVisitService from '../../../../services/localStorage/ProjectsVisitService';
// Types
import { RootState } from '../../../../store';
import { Project } from '../../../../types/project';

const useSortedProjects = (): Project[] => {
  const { id: userId } = useSelector((state: RootState) => state.profile);

  const history = ProjectsVisitService.getHistory(+userId);

  const unsortedProjects = useSelector(
    (state: RootState) => state.projectsList,
  );

  const sortedProjects = useMemo(
    () =>
      history.reduce((acc, p) => {
        const project = unsortedProjects.find((x) => x.id === +p.project);
        if (project) acc.push({ ...project, opened: p.time });
        return acc;
      }, [] as Project[]),
    [history, unsortedProjects],
  );

  const remainingProjects = useMemo(
    () =>
      unsortedProjects
        .reduce((acc, p) => {
          if (!history.map((x) => String(x.project)).includes(String(p.id))) {
            acc.push(p);
          }
          return acc;
        }, [] as Project[])
        .sort((p1, p2) => p1.name.localeCompare(p2.name)),
    [history, unsortedProjects],
  );

  const sortedList = [
    // add the ones already opened
    ...sortedProjects,
    // append the rest in alphabetical order
    ...remainingProjects,
  ];
  return sortedList;
};

export default useSortedProjects;
