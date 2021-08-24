import {
  JupyterSettings,
  RunningApplication,
  RunningServer,
} from '../../types/jupiter';
import BaseApiService, { RequestType } from '../BaseApiService';

export enum ErrorCodes {
  NO_JUPYTER_SERVER = 100033,
  NO_ANACONDA_ENVIRONMENT = 300000,
}

class JupyterService extends BaseApiService {
  // get = async ({ projectId }: { projectId: number }): Promise<any> => {
  //   const { data } = await this.request<any>({
  //     url: `${projectId}/jupyter`,
  //     type: RequestType.get,
  //   });
  //   return data;
  // };

  getEnvironments = async ({
    projectId,
  }: {
    projectId: number;
  }): Promise<any> => {
    try {
      const { data } = await this.request<any>({
        url: `${projectId}/python/environments?expand=libraries`,
        type: RequestType.get,
      });
      return data;
    } catch (err) {
      // "No Anaconda environment created for this project."
      if (
        err?.response?.data.errorCode === ErrorCodes.NO_ANACONDA_ENVIRONMENT
      ) {
        return false;
      }
      throw err;
    }
  };

  getRunningServer = async ({
    projectId,
  }: {
    projectId: number;
  }): Promise<RunningServer | null> => {
    try {
      const { data } = await this.request<any>({
        url: `${projectId}/jupyter/running`,
        type: RequestType.get,
      });
      return data;
    } catch (err) {
      // "Could not find any Jupyter notebook servers for this project."
      if (err?.response?.data?.errorCode === ErrorCodes.NO_JUPYTER_SERVER) {
        return null;
      }
      throw err;
    }
  };

  getRunningApplications = async ({
    projectId,
  }: {
    projectId: number;
  }): Promise<RunningApplication[]> => {
    const { data } = await this.request<any>({
      url: `${projectId}/jupyter/livy/sessions`,
      type: RequestType.get,
    });
    return data;
  };

  getSettings = async ({
    projectId,
  }: {
    projectId: number;
  }): Promise<JupyterSettings> => {
    const { data } = await this.request<any>({
      url: `${projectId}/jupyter/settings`,
      type: RequestType.get,
    });
    return data;
  };

  start = async ({
    projectId,
    settings,
  }: {
    projectId: number;
    settings: JupyterSettings | undefined;
  }): Promise<RunningServer> => {
    const { data } = await this.request<any>({
      url: `${projectId}/jupyter/start`,
      type: RequestType.post,
      data: settings,
    });
    return data;
  };

  stop = async ({ projectId }: { projectId: number }): Promise<any> => {
    const { data } = await this.request<any>({
      url: `${projectId}/jupyter/stop`,
      type: RequestType.get,
    });
    return data;
  };

  stopApplication = async ({
    projectId,
    appId,
  }: {
    projectId: number;
    appId: string;
  }): Promise<RunningApplication[]> => {
    const { data } = await this.request<any>({
      url: `${projectId}/jupyter/livy/sessions/${appId}`,
      type: RequestType.delete,
    });
    return data;
  };
}

export default new JupyterService('/project');
