import { useDispatch } from 'react-redux';
import { Dispatch } from '../store';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const useLastProject = () => {
  const dispatch = useDispatch<Dispatch>();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch.store.setProject({
        projectId: +id,
      });
    }
  }, [id, dispatch]);
};

export default useLastProject;
