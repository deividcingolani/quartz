import React, { FC, memo } from 'react';
import { Flex } from 'rebass';

// Components
import Suspense from '../../components/suspense/Suspense';
import ErrorBoundary from '../../components/error-boundary/ErrorBoundary';
import GlobalErrors from '../../components/error/GlobalErrors';
// Hooks
import useErrorCleaner from '../../hooks/useErrorCleaner';
// Styles
import styles from '../project-management/pm-layout-styles';

export interface AuthLayoutProps {
  children: React.ReactElement;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }: AuthLayoutProps) => {
  useErrorCleaner();

  return (
    <Flex width="100%" height="100%" overflow="auto" flexDirection="column">
      <Flex width="100%" height="100%">
        <Flex
          flexGrow={1}
          justifyContent="center"
          minWidth="939px"
          id="content"
          p="30px"
          sx={styles}
          pr="50px"
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

export default memo(AuthLayout);
