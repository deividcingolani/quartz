import { useEffect } from 'react';
// Hooks
import { useDispatch, useSelector } from 'react-redux';
// Types
import { Dispatch, RootState } from '../../../../store';
// Selectors
import { selectSettings } from '../../../../store/models/jupyter/jupyter.selectors';

export interface JupyterSettings {
  data: any;
  isLoading: boolean;
}

const useJupyterSettings = (projectId: number): JupyterSettings => {
  const dispatch = useDispatch<Dispatch>();
  const { data: settings, isLoading } = useSelector(selectSettings);
  const { id: userId } = useSelector((state: RootState) => state.profile);

  useEffect(() => {
    if (!isLoading && !settings) {
      dispatch.jupyter.fetchSettings({ userId: +userId, projectId });
    }
  }, [dispatch.jupyter, isLoading, projectId, settings, userId]);

  return { data: settings, isLoading };
};

export default useJupyterSettings;
