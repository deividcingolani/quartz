import { createModel } from '@rematch/core';
import PythonService from '../../../services/project/PythonService';
import {
  PythonLibraryDTO,
  PythonLibraryListDTO,
  PythonLibrarySearchListDTO,
} from '../../../types/python';
// eslint-disable-next-line import/no-cycle
import { Dispatch } from '../../index';
// eslint-disable-next-line import/no-cycle
import { RootModel } from '../index';
import { APIError } from '../../../types/error';

export type PythonLibraryState = StateType;

interface StateType {
  library: PythonLibraryDTO | undefined;
  libraries: PythonLibraryListDTO | APIError | undefined;
}

const pythonLibrary = createModel<RootModel>()({
  state: { library: undefined, libraries: undefined } as PythonLibraryState,
  reducers: {
    setPythonLibrary: (
      currentState: PythonLibraryState,
      payload: PythonLibraryDTO,
    ): PythonLibraryState => {
      return { library: payload, libraries: currentState.libraries };
    },
    setPythonLibraries: (
      currentState: PythonLibraryState,
      payload: PythonLibraryListDTO | APIError,
    ): PythonLibraryState => {
      return { library: currentState.library, libraries: payload };
    },
  },
  effects: (dispatch: Dispatch) => ({
    getPythonLibrary: async ({
      id,
      version,
      name,
    }: {
      id: number;
      version: string;
      name: string;
    }): Promise<void> => {
      const pythonLib: PythonLibraryDTO = await PythonService.getLibrary(
        id,
        version,
        name,
      );

      const mappedPythonLibrary = {
        ...pythonLib,
      };

      dispatch.pythonLibrary.setPythonLibrary(mappedPythonLibrary);
    },
    installLibrary: async ({
      id,
      version,
      name,
      data,
    }: {
      id: number;
      version: string;
      name: string;
      data: any;
    }): Promise<PythonLibraryDTO> => {
      return PythonService.installLibrary(id, version, name, data);
    },
    uninstallLibrary: async ({
      id,
      version,
      name,
    }: {
      id: number;
      version: string;
      name: string;
    }): Promise<any> => {
      return PythonService.uninstallLibrary(id, version, name);
    },
    getLibrariesWithOperations: async ({
      id,
      version,
    }: {
      id: number;
      version: string;
    }): Promise<any> => {
      const libs: PythonLibraryListDTO | APIError =
        await PythonService.getLibrariesWithOperations(id, version);
      dispatch.pythonLibrary.setPythonLibraries(libs);
    },
    getLibraries: async ({
      id,
      version,
    }: {
      id: number;
      version: string;
    }): Promise<any> => {
      const libs: PythonLibraryListDTO = await PythonService.getLibraries(
        id,
        version,
      );
      dispatch.pythonLibrary.setPythonLibraries(libs);
    },
    searchLibraries: async ({
      id,
      version,
      searchQuery,
      manager,
      channel,
    }: {
      id: number;
      version: string;
      searchQuery: string;
      manager: string;
      channel?: string;
    }): Promise<PythonLibrarySearchListDTO> => {
      const libs: PythonLibrarySearchListDTO =
        await PythonService.searchLibraries(
          id,
          version,
          searchQuery,
          manager,
          channel,
        );
      return libs;
    },
    deleteLibraryCommands: async ({
      id,
      version,
      name,
    }: {
      id: number;
      version: string;
      name: string;
    }): Promise<void> => {
      await PythonService.deleteLibraryCommands(id, version, name);
    },
    retryLibraryCommands: async ({
      id,
      version,
      name,
    }: {
      id: number;
      version: string;
      name: string;
    }): Promise<void> => {
      await PythonService.retryLibraryCommands(id, version, name);
    },
  }),
});

export default pythonLibrary;
