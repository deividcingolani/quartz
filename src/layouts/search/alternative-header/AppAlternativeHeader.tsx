// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC } from 'react';
import { AlternativeHeader } from '@logicalclocks/quartz';

// Hooks
import useTabsNavigation from '../navigation/useTabsNavigation';
import ErrorBoundary from '../../../components/error-boundary/ErrorBoundary';

const AppAlternativeHeader: FC = () => {
  const { tabs } = useTabsNavigation();

  return <AlternativeHeader tabs={tabs} />;
};

const withErrorBoundary = () => (
  <ErrorBoundary>
    <AppAlternativeHeader />
  </ErrorBoundary>
);

export default withErrorBoundary;
