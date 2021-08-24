import { JupyterState } from '../../../types/jupiter';
import { RootState } from '../../index';

export type SelectData<Data> = {
  data: Data;
  isLoading: boolean;
};

export const selectJupyterLoading = ({
  loading,
}: RootState): SelectData<JupyterState> =>
  loading.effects.jupyter.fetchEnvironmentReadyness ||
  loading.effects.jupyter.fetchRunningServer ||
  // loading.effects.jupyter.fetchRunningApplications ||
  loading.effects.jupyter.fetchSettings;

export const selectJupyter = ({
  jupyter,
  loading,
}: RootState): SelectData<JupyterState> => ({
  data: jupyter,
  isLoading:
    loading.effects.jupyter.fetchEnvironmentReadyness ||
    loading.effects.jupyter.fetchRunningServer ||
    loading.effects.jupyter.fetchRunningApplications ||
    loading.effects.jupyter.fetchSettings,
});

export const selectEnvironment = ({
  jupyter,
  loading,
}: RootState): SelectData<JupyterState['environment']> => ({
  data: jupyter.environment,
  isLoading: loading.effects.jupyter.fetchEnvironmentReadyness,
});

export const selectRunningServer = ({
  jupyter,
  loading,
}: RootState): SelectData<JupyterState['runningServer']> => ({
  data: jupyter.runningServer,
  isLoading: loading.effects.jupyter.fetchRunningServer,
});

export const selectRunningApplications = ({
  jupyter,
  loading,
}: RootState): SelectData<JupyterState['runningApplications']> => ({
  data: jupyter.runningApplications,
  isLoading: loading.effects.jupyter.fetchRunningApplications,
});

export const selectSettings = ({
  jupyter,
  loading,
}: RootState): SelectData<JupyterState['settings']> => ({
  data: jupyter.settings,
  isLoading: loading.effects.jupyter.fetchSettings,
});
