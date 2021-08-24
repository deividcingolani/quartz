// eslint-disable-next-line import/no-cycle
import { timeAliveOptions } from '../../store/models/jupyter/jupyter.model';
import { LS_JUPYTER_KEY } from './constants';
import LocalStorageService from './LocalStorageService';

export interface JupyterConfigState {
  timeAlive: typeof timeAliveOptions;
  settings: any;
}

export enum LSInnerKeys {
  'timeAlive' = 'timeAlive',
  'settings' = 'settings',
}

type JupyterSetter =
  | {
      key: LSInnerKeys.timeAlive;
      items: JupyterConfigState['timeAlive'];
    }
  | {
      key: LSInnerKeys.settings;
      items: JupyterConfigState['settings'];
    };

class JupyterConfigService extends LocalStorageService<JupyterConfigState> {
  public getTimeAlive(
    userId: number,
    projectId: number,
  ): JupyterConfigState['timeAlive'] {
    return this.get(userId, projectId)?.timeAlive;
  }

  public getSettings(
    userId: number,
    projectId: number,
  ): JupyterConfigState['settings'] {
    return this.get(userId, projectId)?.settings;
  }

  public set(
    userId: number,
    projectId: number,
    { key, items }: JupyterSetter,
  ): void {
    const all = this.getAll();
    const userProjects = all?.[userId];
    const currentProject = userProjects?.[projectId];
    const updated = {
      ...all,
      [userId]: {
        ...userProjects,
        [projectId]: {
          ...currentProject,
          [key]: items,
        },
      },
    };
    localStorage.setItem(this.localStorageKey, JSON.stringify(updated));
  }

  public delete({
    key,
    userId,
    projectId,
  }: {
    userId: number;
    key: LSInnerKeys;
    projectId: number;
  }): void {
    const all = this.getAll();
    const userProjects = all?.[userId];
    if (userProjects?.[projectId]) {
      delete userProjects[projectId][key];
    }
    const updated = {
      ...all,
      [userId]: {
        ...userProjects,
      },
    };
    localStorage.setItem(this.localStorageKey, JSON.stringify(updated));
  }
}

export default new JupyterConfigService(LS_JUPYTER_KEY);
