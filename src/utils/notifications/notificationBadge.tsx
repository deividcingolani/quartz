import React, { FC } from 'react';
import { Badge } from '@logicalclocks/quartz';

export interface NotificationBadgeProps {
  message?: string;
  variant?: 'light' | 'bold' | 'fail' | 'success' | 'label';
}

const NotificationBadge: FC<NotificationBadgeProps> = ({
  message = 'server error',
  variant = 'fail',
}) => {
  return (
    <Badge width="fit-content" mb="14px" variant={variant} value={message} />
  );
};

export default NotificationBadge;
