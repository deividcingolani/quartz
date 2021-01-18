import React, { FC } from 'react';
import { Label } from '@logicalclocks/quartz';

export interface NotificationBadgeProps {
  message?: string;
  variant?: 'light' | 'bold' | 'fail' | 'success' | 'label';
}

const NotificationTitle: FC<NotificationBadgeProps> = ({
  message = 'Server Error',
}) => {
  return <Label fontSize="18px">{message}</Label>;
};

export default NotificationTitle;
