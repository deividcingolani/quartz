import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Dispatch } from '../store';

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
