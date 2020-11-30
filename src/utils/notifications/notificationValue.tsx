import React, { FC } from 'react';
import { Label } from '@logicalclocks/quartz';

const NotificationContent: FC<{ message?: string }> = ({
  message = 'Try again later or contact the support',
}) => {
  return <Label>{message}</Label>;
};

export default NotificationContent;
