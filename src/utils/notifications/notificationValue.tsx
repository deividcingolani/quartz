import React, { FC, ReactElement } from 'react';
import { Labeling } from '@logicalclocks/quartz';

const NotificationContent: FC<{
  message?: string;
  element?: ReactElement;
}> = ({ message = 'Try again later or contact the support', element }) => {
  if (element) {
    return element;
  }
  return <Labeling>{message}</Labeling>;
};

export default NotificationContent;
