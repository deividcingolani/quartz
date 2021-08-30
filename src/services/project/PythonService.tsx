import BaseApiService, { RequestType } from '../BaseApiService';

import {
  PythonConflictListDTO,
  PythonEnvironmentDTO,
  PythonLibraryDTO,
  PythonLibraryListDTO,
  PythonLibrarySearchListDTO,
} from '../../types/python';
import { APIError } from '../../types/error';

class PythonService extends BaseApiService {
  environmentStillInitializingErrorCode = 300011;

  noEnvironmentErrorCode = 300000;

  // libraryAlreadyInstalledErrorCode = 100028;

  getEnvironments = async (
    projectId: number,
  ): Promise<PythonEnvironmentDTO | APIError> => {
    return this.request<PythonEnvironmentDTO | APIError>({
      url: `${projectId}/python/environments`,
      type: RequestType.get,
    })
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        if (err.response?.data) {
          const error = err.response.data;
          if (
            'errorCode' in error &&
            (error as APIError).errorCode === this.noEnvironmentErrorCode
          ) {
            return error;
          }
        }
        throw err;
      });
  };

  // Not used
  getEnvironmentWithLibraries = async (
    projectId: number,
    version: string,
  ): Promise<PythonEnvironmentDTO> => {
    const { data } = await this.request<PythonEnvironmentDTO>({
      url: `${projectId}/python/environments/${version}?expand=libraries`,
      type: RequestType.get,
    });
    return data;
  };

  getEnvironmentWithOperations = async (
    projectId: number,
    version: string,
  ): Promise<PythonEnvironmentDTO | APIError> => {
    return this.request<PythonEnvironmentDTO | APIError>({
      url: `${projectId}/python/environments/${version}?expand=commands`,
      type: RequestType.get,
    })
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        if (err.response?.data) {
          const error = err.response.data;
          if (
            'errorCode' in error &&
            ((error as APIError).errorCode ===
              this.environmentStillInitializingErrorCode ||
              (error as APIError).errorCode === this.noEnvironmentErrorCode)
          ) {
            return error;
          }
        }
        throw err;
      });
  };

  createEnvironment = async (
    projectId: number,
    version: string,
  ): Promise<any> => {
    await this.request<any>({
      url: `${projectId}/python/environments/${version}?action=create`,
      type: RequestType.post,
    });
  };

  exportEnvironment = async (
    projectId: number,
    version: string,
  ): Promise<any> => {
    await this.request<any>({
      url: `${projectId}/python/environments/${version}?action=export`,
      type: RequestType.post,
    });
  };

  deleteEnvironment = async (
    projectId: number,
    version: string,
  ): Promise<any> => {
    await this.request<any>({
      url: `${projectId}/python/environments/${version}`,
      type: RequestType.delete,
    });
  };

  editEnvironment = async (id: number, data: any): Promise<any> => {
    await this.request<any>({
      url: `/${id}`,
      type: RequestType.put,
      data,
    });
  };

  // ---------------- COMMANDS/OPERATIONS

  getCommands = async (
    projectId: number,
    version: string,
  ): Promise<PythonLibraryDTO[]> => {
    const { data } = await this.request<PythonLibraryDTO[]>({
      url: `${projectId}/python/environments/${version}/commands`,
      type: RequestType.get,
    });
    return data;
  };

  // ---------------- LIBRARIES

  getLibraries = async (
    projectId: number,
    version: string,
  ): Promise<PythonLibraryListDTO> => {
    const { data } = await this.request<PythonLibraryListDTO>({
      url: `${projectId}/python/environments/${version}/libraries`,
      type: RequestType.get,
    });
    return data;
  };

  getLibrariesWithOperations = async (
    projectId: number,
    version: string,
  ): Promise<PythonLibraryListDTO | APIError> => {
    return this.request<PythonLibraryListDTO | APIError>({
      url: `${projectId}/python/environments/${version}/libraries?expand=commands`,
      type: RequestType.get,
    })
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        if (err.response?.data) {
          const error = err.response.data;
          if (
            'errorCode' in error &&
            ((error as APIError).errorCode ===
              this.environmentStillInitializingErrorCode ||
              (error as APIError).errorCode === this.noEnvironmentErrorCode)
          ) {
            return error;
          }
        }
        throw err;
      });
  };

  getLibrary = async (
    projectId: number,
    version: string,
    name: string,
  ): Promise<PythonLibraryDTO> => {
    const { data } = await this.request<PythonLibraryDTO>({
      url: `${projectId}/python/environments/${version}/libraries/${name}`,
      type: RequestType.get,
    });
    return data;
  };

  installLibrary = async (
    id: number,
    version: string,
    name: string,
    data: any,
  ): Promise<PythonLibraryDTO> => {
    return this.request<PythonLibraryDTO>({
      url: `/${id}/python/environments/${version}/libraries/${name}`,
      type: RequestType.post,
      data,
    }).then(({ data }) => {
      return data;
    });
  };

  uninstallLibrary = async (
    id: number,
    version: string,
    name: string,
  ): Promise<any> => {
    await this.request<any>({
      url: `/${id}/python/environments/${version}/libraries/${name}`,
      type: RequestType.delete,
    });
  };

  searchLibraries = async (
    projectId: number,
    version: string,
    searchQuery: string,
    manager: string,
    channel?: string,
  ): Promise<PythonLibrarySearchListDTO> => {
    const searchParams: URLSearchParams = new URLSearchParams({
      query: searchQuery,
    });
    if (channel) {
      searchParams.append('channel', channel);
    }

    return this.request<PythonLibrarySearchListDTO>({
      url: `${projectId}/python/environments/${version}/libraries/${manager}?${searchParams.toString()}`,
      type: RequestType.get,
    }).then((res) => {
      if (res.data) {
        return res.data;
      }
      return {
        items: [],
        type: '',
        count: 0,
        library: '',
        href: '',
        status: '',
      } as PythonLibrarySearchListDTO;
    });
  };

  getConflicts = async (
    projectId: number,
    version: string,
  ): Promise<PythonConflictListDTO | APIError> => {
    return this.request<PythonConflictListDTO | APIError>({
      url: `${projectId}/python/environments/${version}/conflicts`,
      type: RequestType.get,
    })
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        if (err.response?.data) {
          const error = err.response.data;
          if (
            'errorCode' in error &&
            ((error as APIError).errorCode ===
              this.environmentStillInitializingErrorCode ||
              (error as APIError).errorCode === this.noEnvironmentErrorCode)
          ) {
            return error;
          }
        }
        throw err;
      });
  };

  deleteEnvironmentCommands = async (
    projectId: number,
    version: string,
  ): Promise<void> => {
    await this.request<any>({
      url: `${projectId}/python/environments/${version}/commands`,
      type: RequestType.delete,
    });
  };

  deleteLibraryCommands = async (
    id: number,
    version: string,
    name: string,
  ): Promise<any> => {
    await this.request<any>({
      url: `/${id}/python/environments/${version}/libraries/${name}/commands`,
      type: RequestType.delete,
    });
  };

  retryEnvironmentCommands = async (
    projectId: number,
    version: string,
  ): Promise<void> => {
    await this.request<any>({
      url: `${projectId}/python/environments/${version}/commands`,
      type: RequestType.put,
    });
  };

  retryLibraryCommands = async (
    id: number,
    version: string,
    name: string,
  ): Promise<any> => {
    await this.request<any>({
      url: `/${id}/python/environments/${version}/libraries/${name}/commands`,
      type: RequestType.put,
    });
  };
}

export default new PythonService('/project');
