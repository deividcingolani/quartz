import React, { FC, memo, ReactElement, useCallback, useEffect } from 'react';

// Hooks
import { useDispatch, useSelector } from 'react-redux';
import { NotificationsManager } from '@logicalclocks/quartz';
// Types
import { Dispatch, RootState } from '../../store';
// Components
import Error404 from '../../pages/error/404Error';
import ConnectionError from '../../pages/error/ConnectionError';
// Utils
import NotificationBadge from '../../utils/notifications/notificationBadge';
import NotificationContent from '../../utils/notifications/notificationValue';
// Services
import TokenService from '../../services/TokenService';

const GlobalErrors: FC<{ children: ReactElement }> = ({ children }) => {
  const globalError = useSelector(
    (state: RootState) => state.error.globalError,
  );

  const dispatch = useDispatch<Dispatch>();

  const error = useSelector((state: RootState) => state.error.error);

  const logout = useCallback(() => {
    dispatch.auth.clear();
    TokenService.delete();
    dispatch.projectsList.clear();
    dispatch.error.clearGlobal();
  }, [dispatch]);

  useEffect(() => {
    if (error && error.response?.status !== 401) {
      NotificationsManager.create({
        type: <NotificationBadge />,
        content: <NotificationContent />,
      });
      dispatch.error.clearError();
    }
    // eslint-disable-next-line
  }, [error]);

  useEffect(() => {
    if (error) {
      logout();
    }
    // eslint-disable-next-line
  }, [error]);

  if (globalError) {
    switch (globalError.status || globalError.response?.status) {
      case 404:
        return <Error404 />;
      default:
        return <ConnectionError />;
    }
  }

  return children;
};

export default memo(GlobalErrors);
