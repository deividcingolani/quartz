import React, { FC } from 'react';
import { AlternativeHeader } from '@logicalclocks/quartz';

// Hooks
import useTabsNavigation from '../navigation/useTabsNavigation';

const AppAlternativeHeader: FC = () => {
  const { tabs } = useTabsNavigation();

  return <AlternativeHeader title="Cluster settings" tabs={tabs} />;
};

export default AppAlternativeHeader;
