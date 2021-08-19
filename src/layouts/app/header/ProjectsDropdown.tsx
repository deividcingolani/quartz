// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  List,
  ListItem,
  Subtitle,
  useDropdown,
  useOnClickOutside,
} from '@logicalclocks/quartz';
import { useNavigate, useParams } from 'react-router-dom';

// Styled
import Button from './project-button.styles';
// Types
import { Dispatch, RootState } from '../../../store';
import LastPathService from '../../../services/localStorage/LastPathService';
import useSortedProjects from '../../../pages/project/list/hooks/useSortedProjects';

const ProjectsDropdown: FC = () => {
  const projects = useSortedProjects();
  const isLoading = useSelector(
    (state: RootState) => state.loading.effects.projectsList.getProjects,
  );

  const { id: projectId } = useParams();
  const { id: userId } = useSelector((state: RootState) => state.profile);

  const navigate = useNavigate();
  const dispatch = useDispatch<Dispatch>();

  const buttonRef = useRef(null);

  const [isOpen, handleToggle, handleClickOutside] = useDropdown();
  useOnClickOutside(buttonRef, handleClickOutside);

  const project = useMemo(
    () => projects.find((p) => p.id === +projectId),
    [projectId, projects],
  );

  const title = useMemo(() => {
    if (isLoading) {
      return 'loading...';
    }

    return project?.name ? project.name : 'no project';
  }, [project, isLoading]);

  return (
    <Button onClick={() => handleToggle()} ref={buttonRef}>
      <Subtitle mr="10px">{title}</Subtitle>

      {isOpen && (
        <List>
          {projects.map(({ name, id }, index) => (
            <ListItem
              key={id}
              variant={+projectId === id ? 'active' : 'primary'}
              hasDivider={index === projects.length - 1}
              onClick={() => {
                dispatch.featureStores.clear();
                navigate(`/p/${id}/view`);
              }}
            >
              {name}
            </ListItem>
          ))}
          <ListItem
            onClick={() => {
              // We need to remove the last page viewed here
              // otherwise the / will redirect users to the project
              // they are coming from
              LastPathService.delete(userId);
              navigate('/');
            }}
          >
            All Projects
          </ListItem>
        </List>
      )}
      <svg
        width="14"
        height="8"
        viewBox="0 0 14 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.07114 5.31388L12.0211 0.363882C12.1134 0.268372 12.2237 0.19219 12.3457 0.139781C12.4677 0.0873716 12.599 0.0597853 12.7317 0.0586315C12.8645 0.0574777 12.9962 0.0827794 13.1191 0.13306C13.242 0.183341 13.3536 0.257594 13.4475 0.351487C13.5414 0.44538 13.6157 0.557032 13.666 0.679928C13.7162 0.802824 13.7415 0.934504 13.7404 1.06728C13.7392 1.20006 13.7117 1.33128 13.6592 1.45329C13.6068 1.57529 13.5307 1.68564 13.4351 1.77788L7.77814 7.43488C7.59062 7.62235 7.33631 7.72767 7.07114 7.72767C6.80598 7.72767 6.55167 7.62235 6.36414 7.43488L0.707144 1.77788C0.611633 1.68564 0.535451 1.57529 0.483042 1.45329C0.430633 1.33128 0.403047 1.20006 0.401893 1.06728C0.400739 0.934504 0.426041 0.802824 0.476322 0.679928C0.526603 0.557032 0.600856 0.44538 0.694749 0.351487C0.788641 0.257594 0.900293 0.183341 1.02319 0.13306C1.14609 0.0827794 1.27777 0.0574777 1.41054 0.0586315C1.54332 0.0597853 1.67454 0.0873716 1.79655 0.139781C1.91855 0.19219 2.0289 0.268372 2.12114 0.363882L7.07114 5.31388Z"
          fill="#272727"
        />
      </svg>
    </Button>
  );
};

export default ProjectsDropdown;
