import { Button } from '@logicalclocks/quartz';
import React, { FC, memo, ReactNode } from 'react';

// Hooks
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// Selectors
import { selectProjectId } from '../../store/models/localManagement/store.selectors';

import { RootState } from '../../store';

export interface ErrorProjectsContentProps {
  actions: ReactNode;
}

const ErrorProjectsContent: FC<ErrorProjectsContentProps> = ({ actions }) => {
  const navigate = useNavigate();

  const lastProjectId = useSelector(selectProjectId);

  const projects = useSelector((state: RootState) => state.projectsList);

  const name = projects.find(({ id }) => lastProjectId === id)?.name;

  if (name) {
    return (
      <>
        <Button onClick={() => navigate(`/p/${lastProjectId}`)}>
          back to {name}
        </Button>
        {actions}
      </>
    );
  }

  return (
    <>
      <Button intent="ghost" onClick={() => navigate('/')}>
        See all projects
      </Button>
      {actions}
    </>
  );
};

export default memo(ErrorProjectsContent);
