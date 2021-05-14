import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const useQueryParams = (): string[] => {
  const location = useLocation();

  const query = useMemo(
    () => new URLSearchParams(location.search).getAll('match'),
    [location.search],
  );
  return query;
};

export default useQueryParams;
