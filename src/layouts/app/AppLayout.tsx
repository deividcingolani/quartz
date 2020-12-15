import React, { FC, memo, MutableRefObject, useEffect, useRef } from 'react';
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
import useLastProject from '../../hooks/useLastProject';

export interface AppLayoutProps {
  children: React.ReactElement;
}

export const ContentContext = React.createContext<
  MutableRefObject<undefined | HTMLDivElement>
>({
  current: undefined,
});

const AppLayout: FC<AppLayoutProps> = ({ children }: AppLayoutProps) => {
  const dispatch = useDispatch<Dispatch>();

  useLastProject();

  useEffect(() => {
    dispatch.projectsList.getProjects();
  }, [dispatch]);

  const contentRef = useRef();

  return (
    <Flex width="100%" height="100%" overflow="auto" flexDirection="column">
      <AppHeader />

      <Flex width="100%" height="calc(100% - 70px)">
        <AppNavigation />

        {/* Content */}
        <Flex
          flexGrow={1}
          ref={contentRef}
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
                <GlobalErrors>
                  <ContentContext.Provider value={contentRef}>
                    {children}
                  </ContentContext.Provider>
                </GlobalErrors>
              </Suspense>
            </ErrorBoundary>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default memo(AppLayout);
