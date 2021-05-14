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

import { Value } from '@logicalclocks/quartz';
import DeepSearch from '../../components/search/DeepSearchInput';
import RightContent from './alternative-header/RightContent';

export interface SettingsLayoutProps {
  children: React.ReactElement;
}

const SearchLayout: FC<SettingsLayoutProps> = ({
  children,
}: SettingsLayoutProps) => {
  return (
    <Flex width="100%" height="100%" flexDirection="column">
      <AppHeader showList={false} hasBackButton={true} />
      <Flex
        height="calc(100% - 70px)"
        width="100%"
        flexDirection="column"
        overflow="auto"
        alignItems="center"
      >
        <Value fontSize="24px" fontFamily="Inter" fontWeight="bold" mt="40px">
          Advanced search
        </Value>
        <Flex width="100%" alignItems="center" flexDirection="column">
          <Flex width="100%" sx={styles}>
            <Flex
              width="100%"
              mx="150px"
              maxWidth="1200px"
              flexDirection="row"
              alignItems="flex-end"
            >
              <DeepSearch width="100%" deepSearchButtons={false} />
              <RightContent />
            </Flex>
          </Flex>
          <Flex width="100%" justifyContent="center">
            <Flex maxWidth="1200px" mx="150px" width="100%">
              <AppAlternativeHeader />
            </Flex>
          </Flex>
          <ErrorBoundary>
            <Suspense>
              <GlobalErrors>{children}</GlobalErrors>
            </Suspense>
          </ErrorBoundary>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default SearchLayout;
