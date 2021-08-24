import { createModel } from '@rematch/core';
// eslint-disable-next-line import/no-cycle
import JupyterConfigService from '../../../services/localStorage/JupyterConfigService';
import JupyterService from '../../../services/project/JupyterService';
import {
  EnvironmentState,
  JupyterSettings,
  JupyterState,
  Library,
  RunningServer,
} from '../../../types/jupiter';

const REQUIRED_LIBRARIES = [
  'jupyterlab',
  'sparkmagic',
  'hdfscontents',
  'hdijupyterutils',
];

const initialState = {
  runningServer: null,
  runningApplications: null,
  environment: null,
  settings: null,
} as JupyterState;

export const timeAliveOptions = {
  '6h': 6,
  '12h': 12,
  'no limit': 'nolimit',
};

const jupyter = createModel()({
  state: initialState,
  reducers: {
    setState: (_: JupyterState, payload: JupyterState): JupyterState => payload,
    setEnvironmentReadyness: (
      state: JupyterState,
      payload: JupyterState['environment'],
    ): JupyterState => ({
      ...state,
      environment: payload,
    }),
    setRunningServer: (
      state: JupyterState,
      payload: JupyterState['runningServer'],
    ): JupyterState => ({
      ...state,
      runningServer: payload,
    }),
    setSettings: (
      state: JupyterState,
      payload: JupyterState['settings'],
    ): JupyterState => ({
      ...state,
      settings: payload,
    }),
    setRunningApplications: (
      state: JupyterState,
      payload: JupyterState['runningApplications'],
    ): JupyterState => ({
      ...state,
      runningApplications: payload,
    }),
    clear: () => initialState,
  },
  effects: (dispatch) => ({
    fetch: async ({
      userId,
      projectId,
    }: {
      userId: number;
      projectId: number;
    }): Promise<void> => {
      const { isReady } = await dispatch.jupyter.fetchEnvironmentReadyness({
        projectId,
      });

      if (isReady) {
        await dispatch.jupyter.fetchSettings({ userId, projectId });

        const servers = await dispatch.jupyter.fetchRunningServer({
          projectId,
        });

        if (servers) {
          dispatch.jupyter.fetchRunningApplications({
            projectId,
          });
        }
      }
    },
    fetchRunningServer: async ({
      projectId,
    }: {
      projectId: number;
    }): Promise<RunningServer | null> => {
      const data = await JupyterService.getRunningServer({ projectId });
      dispatch.jupyter.setRunningServer(data || false);
      return data;
    },
    fetchRunningApplications: async ({
      projectId,
    }: {
      projectId: number;
    }): Promise<void> => {
      const data = await JupyterService.getRunningApplications({ projectId });
      dispatch.jupyter.setRunningApplications(data);
    },
    fetchEnvironmentReadyness: async ({
      projectId,
    }: {
      projectId: number;
    }): Promise<EnvironmentState> => {
      const res = await JupyterService.getEnvironments({ projectId });
      const environment = res?.items?.[0];
      const installedLibs = environment?.libraries?.items || [];
      const libsNames = installedLibs.map((l: Library) => l.library);
      const missing = REQUIRED_LIBRARIES.filter((l) => !libsNames.includes(l));
      const isReady = missing.length === 0;
      const result = { isReady, missingLibraries: missing };
      dispatch.jupyter.setEnvironmentReadyness(result);
      return result;
    },
    fetchSettings: async ({
      userId,
      projectId,
    }: {
      userId: number;
      projectId: number;
    }): Promise<JupyterSettings> => {
      const localSettings = JupyterConfigService.getSettings(userId, projectId);
      const localAlive = JupyterConfigService.getTimeAlive(userId, projectId);
      const settings = await JupyterService.getSettings({ projectId });

      const mergedSettings = {
        ...settings,
        ...(localSettings && {
          jobConfig: {
            ...settings.jobConfig,
            localSettings,
          },
        }),
        ...(localAlive && {
          shutdownLevel: (timeAliveOptions as any)[localAlive as any],
        }),
      };

      dispatch.jupyter.setSettings(mergedSettings);
      return mergedSettings;
    },
    start: async ({
      projectId,
      settings,
    }: {
      projectId: number;
      settings?: JupyterSettings;
    }): Promise<RunningServer> => {
      const data = await JupyterService.start({
        projectId,
        settings,
      });
      dispatch.jupyter.setRunningServer(data);
      return data;
    },
    stop: async ({
      projectId,
      userId,
    }: {
      projectId: number;
      userId: number;
    }): Promise<void> => {
      await JupyterService.stop({ projectId });
      await dispatch.jupyter.fetchSettings({ projectId, userId });
      dispatch.jupyter.setRunningServer(null);
      dispatch.jupyter.setRunningApplications(null);
    },
    stopApplication: async ({
      projectId,
      appId,
    }: {
      projectId: number;
      appId: string;
    }): Promise<void> => {
      await JupyterService.stopApplication({ projectId, appId });
      await dispatch.jupyter.fetchRunningApplications({ projectId });
    },
  }),
});

export default jupyter;
