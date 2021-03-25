import React, { FC } from 'react';
import { AlternativeHeader } from '@logicalclocks/quartz';

// Hooks
import useTabsNavigation from '../navigation/useTabsNavigation';
import RightContent from './RightContent';
import ErrorBoundary from '../../../components/error-boundary/ErrorBoundary';

const AppAlternativeHeader: FC = () => {
  const { tabs } = useTabsNavigation();

  const { TopContent, BottomContent } = RightContent();

  return (
    <AlternativeHeader
      tabs={tabs}
      title="Advanced search"
      rightTopContent={TopContent}
      rightBottomContent={BottomContent}
    />
  );
};

const withErrorBoundary = () => (
  <ErrorBoundary>
    <AppAlternativeHeader />
  </ErrorBoundary>
);

export default withErrorBoundary;
