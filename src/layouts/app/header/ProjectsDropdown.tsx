import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  List,
  ListItem,
  Subtitle,
  FolderIcon,
  useDropdown,
  useOnClickOutside,
} from '@logicalclocks/quartz';
import { useNavigate, useParams } from 'react-router-dom';

// Selectors
import { projectsList } from '../../../store/models/projects/selectors';
// Styled
import Button from './project-button.styles';

const ProjectsDropdown: FC = () => {
  const projects = useSelector(projectsList);
  const { id: projectId } = useParams();
  const navigate = useNavigate();

  const buttonRef = useRef(null);

  const [isOpen, handleToggle, handleClickOutside] = useDropdown();
  useOnClickOutside(buttonRef, handleClickOutside);

  return (
    <Button onClick={() => handleToggle()} ref={buttonRef}>
      <FolderIcon />
      <Subtitle ml="16px">PROJECT ACME</Subtitle>

      {isOpen && (
        <List>
          {projects.map(({ name, id }, index) => (
            <ListItem
              key={id}
              variant={+projectId === id ? 'active' : 'primary'}
              hasDivider={index === projects.length - 1}
              onClick={(): void => navigate(`p/${id}/fg`)}
            >
              {name}
            </ListItem>
          ))}
          <ListItem>
            <FontAwesomeIcon icon="plus" />
            Create New Project
          </ListItem>
        </List>
      )}
    </Button>
  );
};

export default ProjectsDropdown;
