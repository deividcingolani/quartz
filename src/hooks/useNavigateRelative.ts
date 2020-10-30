import { useCallback, useEffect, useRef } from 'react';
import { useLocation, matchPath, useNavigate } from 'react-router-dom';

export type UseProjectNavigate = (to: string, relativeTo?: string) => void;

const useNavigateRelative = (): UseProjectNavigate => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const prevPathName = useRef(pathname);

  useEffect(() => {
    prevPathName.current = pathname;
  }, [pathname]);

  return useCallback(
    (to, relativeTo = '*') => {
      const match = matchPath(relativeTo, prevPathName.current);

      if (match) {
        navigate(`${match.pathname}${to}`);
      }
    },
    [navigate, prevPathName],
  );
};

export default useNavigateRelative;
