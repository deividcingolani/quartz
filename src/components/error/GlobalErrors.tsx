// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo, ReactElement, useCallback, useEffect } from 'react';
import { Flex } from 'rebass';
import { Button, Labeling, NotificationsManager } from '@logicalclocks/quartz';

// Hooks
import { useDispatch, useSelector } from 'react-redux';

// Types
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { Dispatch, RootState } from '../../store';
// Components
import Error404 from '../../pages/error/404Error';
import Error403 from '../../pages/error/403Error';
import ConnectionError from '../../pages/error/ConnectionError';
// Utils
import NotificationContent from '../../utils/notifications/notificationValue';
import NotificationTitle from '../../utils/notifications/notificationBadge';
import {
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  isClientError,
  isServerError,
} from './errorCodes';
// Services
import TokenService from '../../services/TokenService';

const getErrorTitle = (error: AxiosError) => {
  if (error.message === 'Network Error') {
    return 'Network issue';
  }
  if (error.response?.status && isServerError(error.response.status)) {
    return 'Server Error';
  }
  if (error.response?.status && isClientError(error.response.status)) {
    return 'Client Error';
  }
  return 'Error';
};

const ServerErrorContent: ReactElement = (
  <Flex alignItems="center">
    <Labeling>Try again or</Labeling>
    <Button
      onClick={() => window.open('https://community.hopsworks.ai', '_blank')}
      ml="-10px"
      intent="inline"
    >
      contact the support
    </Button>
  </Flex>
);

const getErrorContent = (
  error: AxiosError,
): { message?: string; element?: ReactElement } => {
  if (error.message === 'Network Error') {
    return {
      element: ServerErrorContent,
    };
  }
  if (error.response?.status && isServerError(error.response.status)) {
    const msg = error.response.data?.usrMsg
      ? error.response.data?.usrMsg
      : error.response.data?.errorMsg;
    return {
      message:
        msg && msg !== 'A generic error occurred.'
          ? msg
          : 'This page can not reach the server',
    };
  }
  if (error.response?.status && isClientError(error.response.status)) {
    const msg = error.response.data?.usrMsg
      ? error.response.data?.usrMsg
      : error.response.data?.errorMsg;
    return { message: msg };
  }
  return {
    message: 'error occurred',
  };
};

const GlobalErrors: FC<{ children: ReactElement }> = ({ children }) => {
  const globalError = useSelector(
    (state: RootState) => state.error.globalError,
  );

  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigate();

  const error = useSelector((state: RootState) => state.error.error);

  const logout = useCallback(() => {
    dispatch.auth.clear();
    TokenService.delete();
    dispatch.projectsList.clear();
    dispatch.error.clearGlobal();
  }, [dispatch]);

  useEffect(() => {
    if (
      error &&
      error.response?.status !== UNAUTHORIZED &&
      error.response?.status !== FORBIDDEN
    ) {
      NotificationsManager.create({
        type: <NotificationTitle message={getErrorTitle(error)} />,
        content: <NotificationContent {...getErrorContent(error)} />,
      });
      dispatch.error.clearError();
    }
    // eslint-disable-next-line
  }, [error]);

  useEffect(() => {
    if (globalError && globalError.config?.method !== 'get') {
      NotificationsManager.create({
        type: <NotificationTitle message={getErrorTitle(globalError)} />,
        content: <NotificationContent {...getErrorContent(globalError)} />,
      });
    }
    // eslint-disable-next-line
  }, [globalError]);

  useEffect(() => {
    if (error?.message === 'Network Error') {
      navigate('/');
    }
    if (
      error &&
      [error.response?.status, error?.status].includes(UNAUTHORIZED)
    ) {
      logout();
    }
    // eslint-disable-next-line
  }, [error]);

  if (globalError && globalError.config?.method === 'get') {
    switch (globalError.status || globalError.response?.status) {
      case NOT_FOUND:
        return <Error404 />;
      case FORBIDDEN:
        return <Error403 />;
      default:
        return <ConnectionError />;
    }
  }

  return children;
};

export default memo(GlobalErrors);
