import React, { FC, memo, ReactElement, useEffect } from 'react';

// Hooks
import { useDispatch, useSelector } from 'react-redux';
import { NotificationsManager } from '@logicalclocks/quartz';
// Types
import { Dispatch, RootState } from '../../store';
// Components
import Error401 from '../../pages/error/401Error';
import Error404 from '../../pages/error/404Error';
import NotificationBadge from '../../utils/notifications/notificationBadge';
import NotificationContent from '../../utils/notifications/notificationValue';

const GlobalErrors: FC<{ children: ReactElement }> = ({ children }) => {
  const globalError = useSelector(
    (state: RootState) => state.error.globalError,
  );

  const dispatch = useDispatch<Dispatch>();

  const error = useSelector((state: RootState) => state.error.error);

  useEffect(() => {
    if (error) {
      NotificationsManager.create({
        type: <NotificationBadge />,
        content: <NotificationContent />,
      });
      dispatch.error.clearError();
    }
    // eslint-disable-next-line
  }, [error]);

  if (globalError) {
    switch (globalError.status || globalError.response?.status) {
      case 401:
        return <Error401 />;
      case 404:
        return <Error404 />;
      default:
        return <Error404 />;
    }
  }

  return children;
};

export default memo(GlobalErrors);
