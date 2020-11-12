import React, { FC } from 'react';
import { Badge } from '@logicalclocks/quartz';

const NotificationBadge: FC = () => {
  return (
    <Badge width="fit-content" mb="14px" variant="fail" value="server error" />
  );
};

export default NotificationBadge;
