import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Types
import { Dispatch, RootState } from '../store';

const useHistory = () => {
  const dispatch = useDispatch<Dispatch>();

  const history = useSelector((state: RootState) => state.store.history);

  const location = useLocation();

  useEffect(() => {
    dispatch.store.addHistoryPath({ path: location.pathname });
  }, [location.pathname, dispatch]);

  return {
    history,
  };
};

export default useHistory;
