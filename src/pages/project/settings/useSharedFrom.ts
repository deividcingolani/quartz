import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Dispatch, RootState } from '../../../store';

const useSharedFrom = (projectId: number) => {
  const dispatch = useDispatch<Dispatch>();

  const isLoading = useSelector(
    (state: RootState) => state.loading.effects.multistore.getSharedFrom,
  );

  const data = useSelector((state: RootState) => state.multistore.from);

  useEffect(() => {
    if (!data && !isLoading) {
      dispatch.multistore.getSharedFrom({ id: projectId });
    }
  }, [projectId, dispatch, isLoading, data]);

  return { data, isLoading };
};

export default useSharedFrom;
