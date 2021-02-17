import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

type Function = () => any;

const useLoadAfterOther = () => {
  const [fc, setFc] = useState<Function | null>(null);

  const loadings = useSelector((state: RootState) => state.loading.effects);

  const isAllLoaded = useMemo(
    () =>
      Object.values(loadings).reduce((acc, value: any) => {
        const hasLoading = Object.values(value).includes(true);

        if (acc) {
          return !hasLoading;
        }

        return acc;
      }, true),
    [loadings],
  );

  useEffect(() => {
    if (isAllLoaded && fc && typeof fc === 'function') {
      fc();

      setFc(null);
    }
  }, [isAllLoaded, fc]);

  const loadAfterAll = useCallback((fn: Function) => {
    setTimeout(() => {
      setFc(() => fn);
    }, 300);
  }, []);

  return {
    loadAfterAll,
  };
};

export default useLoadAfterOther;
