import React, { FC } from 'react';
import { Flex } from 'rebass';

// Components
import AppHeader from '../app/header/AppHeader';
import Suspense from '../../components/suspense/Suspense';
import GlobalErrors from '../../components/error/GlobalErrors';
import ErrorBoundary from '../../components/error-boundary/ErrorBoundary';
import AppAlternativeHeader from './alternative-header/AppAlternativeHeader';
// Styles
import styles from './settings-styles';

export interface SettingsLayoutProps {
  children: React.ReactElement;
}

const SearchLayout: FC<SettingsLayoutProps> = ({
  children,
}: SettingsLayoutProps) => {
  return (
    <Flex width="100%" height="100%" overflow="auto" flexDirection="column">
      <AppHeader showList={false} hasBackButton={true} />

      <AppAlternativeHeader />

      <Flex width="100%" height="100%">
        {/* Content */}
        <Flex
          flexGrow={1}
          justifyContent="center"
          minWidth="939px"
          id="content"
          sx={styles}
        >
          <Flex
            width="100%"
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

export default SearchLayout;
