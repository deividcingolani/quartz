import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Flex } from 'rebass';

// Components
import AppHeader from '../app/header/AppHeader';
import Suspense from '../../components/suspense/Suspense';
import GlobalErrors from '../../components/error/GlobalErrors';
import ErrorBoundary from '../../components/error-boundary/ErrorBoundary';
// Types
import { Dispatch } from '../../store';
// Styles
import styles from './pm-layout-styles';
import useLastProject from '../../hooks/useLastProject';

export interface ProjectManagementLayoutProps {
  children: React.ReactElement;
}

const ProjectManagementLayout: FC<ProjectManagementLayoutProps> = ({
  children,
}: ProjectManagementLayoutProps) => {
  const dispatch = useDispatch<Dispatch>();

  useLastProject();

  useEffect(() => {
    dispatch.projectsList.getProjects();
  }, [dispatch]);

  return (
    <Flex width="100%" height="100%" overflow="auto" flexDirection="column">
      <AppHeader showList={false} />

      <Flex width="100%" height="calc(100% - 70px)">
        {/* Content */}
        <Flex
          flexGrow={1}
          justifyContent="center"
          minWidth="900px"
          id="content"
          sx={styles}
          p="30px"
          pr="50px"
          pb="0"
        >
          <Flex
            width="100%"
            maxWidth="1000px"
            height="100%"
            minHeight="100%"
            flexDirection="column"
          >
            <ErrorBoundary>
              <Suspense>
                <GlobalErrors>{children}</GlobalErrors>
              </Suspense>
            </ErrorBoundary>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ProjectManagementLayout;
