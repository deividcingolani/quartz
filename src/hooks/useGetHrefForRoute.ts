import { useCallback, useEffect, useRef } from 'react';
import { matchPath, useLocation } from 'react-router-dom';

const useGetHrefForRoute = () => {
  const { pathname } = useLocation();
  const prevPathName = useRef(pathname);

  useEffect(() => {
    prevPathName.current = pathname;
  }, [pathname]);

  return useCallback(
    (to: string, relativeTo = '*') => {
      const match = matchPath(relativeTo, prevPathName.current);

      if (match) {
        return `${match.pathname}${to}`;
      }

      return '/';
    },
    [prevPathName],
  );
};

export default useGetHrefForRoute;
