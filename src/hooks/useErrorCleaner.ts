import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch, RootState } from '../store';

const useErrorCleaner = (): void => {
  const globalError = useSelector(
    (state: RootState) => state.error.globalError,
  );
  const dispatch = useDispatch<Dispatch>();
  const location = useLocation();

  useEffect(() => {
    if (globalError) {
      dispatch.error.clearGlobal();
    }
    // eslint-disable-next-line
  }, [location.pathname]);
};

export default useErrorCleaner;
