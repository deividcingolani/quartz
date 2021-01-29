import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { NotificationsManager } from '@logicalclocks/quartz';

const useCloseNotifications = (): void => {
  const location = useLocation();

  useEffect(() => {
    NotificationsManager.closeAllNotifications();
  }, [location.pathname]);
};

export default useCloseNotifications;
