import React, { FC, memo, ReactNode } from 'react';
import { Button } from '@logicalclocks/quartz';
// Hooks
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
// Selectors
import { projectsList } from '../../store/models/projects/selectors';
// Components
import Loader from '../loader/Loader';

export interface ErrorProjectsContentProps {
  actions: ReactNode;
}

const ErrorProjectsContent: FC<ErrorProjectsContentProps> = ({ actions }) => {
  const { projects, isLoading } = useSelector(projectsList);

  const navigate = useNavigate();

  if (isLoading) {
    return <Loader mt="58px" ml="-10px" width={30} height={30} />;
  }

  if (projects.length) {
    return (
      <>
        {projects.map((p) => (
          <Button
            key={p.id}
            intent="secondary"
            onClick={() => navigate(`/p/${p.id}/fg`)}
            mr="14px"
          >
            {p.name}
          </Button>
        ))}
        {actions}
      </>
    );
  }

  return (
    <>
      <Button mr="14px" onClick={() => navigate(`/p/new`)}>
        Create a project
      </Button>
      {actions}
    </>
  );
};

export default memo(ErrorProjectsContent);
