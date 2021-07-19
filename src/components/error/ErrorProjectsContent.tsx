// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo, ReactNode, useCallback } from 'react';
import { Button } from '@logicalclocks/quartz';

// Hooks
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// Selectors
import selectProjectId from '../../store/models/localManagement/store.selectors';

import { RootState } from '../../store';
import pageToViewPathStorageName from '../../routes/storageName';

export interface ErrorProjectsContentProps {
  actions: ReactNode;
}

const ErrorProjectsContent: FC<ErrorProjectsContentProps> = ({ actions }) => {
  const navigate = useNavigate();

  const lastProjectId = useSelector(selectProjectId);

  const projects = useSelector((state: RootState) => state.projectsList);

  const name = projects.find(({ id }) => lastProjectId === id)?.name;

  const goToProjects = useCallback(() => {
    localStorage.removeItem(pageToViewPathStorageName);
    navigate('/');
  }, [navigate]);

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
      <Button intent="ghost" onClick={goToProjects}>
        See all projects
      </Button>
      {actions}
    </>
  );
};

export default memo(ErrorProjectsContent);
