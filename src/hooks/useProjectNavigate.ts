import { useCallback, useEffect, useRef } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';

import routeNames from '../routes/routeNames';

export type UseProjectNavigate = (to: string) => void;

/*
 * The HOOK to navigate according to p/id/"some sub route"
 * */
const useProjectNavigate = (): UseProjectNavigate => {
  const navigate = useNavigate();
  const projectMatch = useMatch(routeNames.project);
  const prevProjectMatch = useRef(projectMatch);

  useEffect(() => {
    prevProjectMatch.current = projectMatch;
  }, [projectMatch]);

  return useCallback(
    (to: string) => {
      if (prevProjectMatch.current) {
        const { pathname } = prevProjectMatch.current;

        navigate(`${pathname}/${to}`);
      } else {
        navigate(routeNames.projectsList);
      }
    },
    [navigate, prevProjectMatch],
  );
};

export default useProjectNavigate;
