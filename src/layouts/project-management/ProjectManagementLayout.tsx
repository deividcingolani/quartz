import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Flex } from 'rebass';

// Components
import AppHeader from '../app/header/AppHeader';
import Suspense from '../../components/suspense/Suspense';
import ErrorBoundary from '../../components/error-boundary/ErrorBoundary';
// Types
import { Dispatch } from '../../store';
// Styles
import styles from './pm-layout-styles';

export interface ProjectManagementLayoutProps {
  children: React.ReactElement;
}

const ProjectManagementLayout: FC<ProjectManagementLayoutProps> = ({
  children,
}: ProjectManagementLayoutProps) => {
  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    dispatch.projectsList.getProjects();
  }, [dispatch]);

  return (
    <Flex width="100%" height="100%" flexDirection="column">
      <AppHeader />
      <Flex
        width="100%"
        height="calc(100% - 70px)"
        alignItems="center"
        justifyContent="center"
        sx={styles}
      >
        <div />
        {/* Content */}
        <ErrorBoundary>
          <Suspense>{children}</Suspense>
        </ErrorBoundary>
      </Flex>
    </Flex>
  );
};

export default ProjectManagementLayout;
