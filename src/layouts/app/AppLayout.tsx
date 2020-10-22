import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Flex } from 'rebass';
import { Dispatch } from '../../store';

// Components
import AppHeader from './header/AppHeader';
import AppNavigation from './navigation/AppNavigation';
import Suspense from '../../components/suspense/Suspense';
import ErrorBoundary from '../../components/error-boundary/ErrorBoundary';

// Styles
import styles from './app-layout-styles';

export interface AppLayoutProps {
  children: React.ReactElement;
}

const AppLayout: FC<AppLayoutProps> = ({ children }: AppLayoutProps) => {
  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    dispatch.projectsList.getProjects();
  }, [dispatch]);

  return (
    <Flex width="100%" height="100%" overflow="auto" flexDirection="column">
      <AppHeader />

      <Flex width="100%" height="calc(100% - 70px)">
        <AppNavigation />

        {/* Content */}
        <Flex
          flexGrow={1}
          justifyContent="center"
          minWidth="939px"
          sx={styles}
          p="30px"
        >
          <Flex flexGrow={1} maxWidth="1274px">
            <ErrorBoundary>
              <Suspense>{children}</Suspense>
            </ErrorBoundary>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default AppLayout;
