// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, ReactElement } from 'react';
import { Labeling } from '@logicalclocks/quartz';

const NotificationContent: FC<{
  message?: string;
  element?: ReactElement;
}> = ({ message = 'Try again later or contact the support', element }) => {
  if (element) {
    return element;
  }
  return (
    <Labeling
      style={{ maxWidth: 600, minWidth: 400 }}
      sx={{
        whiteSpace: 'break-spaces',
        overflowX: 'hidden',
      }}
    >
      {message}
    </Labeling>
  );
};

export default NotificationContent;
