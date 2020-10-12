import React, { FC } from 'react';
import { Flex } from 'rebass';

// Components
import AppHeader from './header/AppHeader';
import AppNavigation from './navigation/AppNavigation';
import ErrorBoundary from '../../components/error-boundary/ErrorBoundary';

// Styles
import styles from './app-layout-styles';

export interface AppLayoutProps {
  children: React.ReactElement;
}

const AppLayout: FC<AppLayoutProps> = ({ children }: AppLayoutProps) => (
  <Flex width="100%" height="100%" flexDirection="column">
    <AppHeader />

    <Flex width="100%" height="100%">
      <AppNavigation />

      {/* Content */}
      <Flex flexGrow={1} sx={styles} p="30px">
        <ErrorBoundary>{children}</ErrorBoundary>
      </Flex>
    </Flex>
  </Flex>
);

export default AppLayout;
