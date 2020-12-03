import React, { FC, memo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Flex } from 'rebass';
import { Dispatch } from '../../store';

// Components
import AppHeader from './header/AppHeader';
import AppNavigation from './navigation/AppNavigation';
import Suspense from '../../components/suspense/Suspense';
import ErrorBoundary from '../../components/error-boundary/ErrorBoundary';
import GlobalErrors from '../../components/error/GlobalErrors';

// Styles
import styles from './app-layout-styles';
import useErrorCleaner from '../../hooks/useErrorCleaner';

export interface AppLayoutProps {
  children: React.ReactElement;
}

const AppLayout: FC<AppLayoutProps> = ({ children }: AppLayoutProps) => {
  const dispatch = useDispatch<Dispatch>();

  useErrorCleaner();

  useEffect(() => {
    dispatch.projectsList.getProjects();
    dispatch.profile.getUser();
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
          id="content"
          sx={styles}
          p="20px"
          pb="0"
        >
          <Flex
            width="100%"
            maxWidth="1274px"
            height="max-content"
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

export default memo(AppLayout);
