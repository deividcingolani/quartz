import { createModel } from '@rematch/core';
import PythonService from '../../../services/project/PythonService';
import {
  PythonEnvironmentDTO,
  PythonEnvironmentListDTO,
} from '../../../types/python';
import { APIError } from '../../../types/error';

export type PythonEnvironmentState = StateType;

interface StateType {
  environment: PythonEnvironmentDTO | undefined;
  environments: PythonEnvironmentListDTO | APIError | undefined;
}

const pythonEnvironment = createModel()({
  state: {
    environment: undefined,
    environments: undefined,
  } as PythonEnvironmentState,
  reducers: {
    setPythonEnvironment: (
      state: PythonEnvironmentState,
      payload: PythonEnvironmentDTO | undefined,
    ): PythonEnvironmentState => {
      return { environment: payload, environments: state.environments };
    },
    setPythonEnvironments: (
      state: PythonEnvironmentState,
      payload: PythonEnvironmentListDTO | APIError | undefined,
    ): PythonEnvironmentState => {
      return { environments: payload, environment: state.environment };
    },
  },
  effects: (dispatch) => ({
    getPythonEnvironments: async ({ id }: { id: number }): Promise<void> => {
      const pythonEnv: PythonEnvironmentDTO | APIError =
        await PythonService.getEnvironments(id);
      dispatch.pythonEnvironment.setPythonEnvironments(pythonEnv);
    },
    getPythonEnvironmentWithLibraries: async ({
      id,
      version,
    }: {
      id: number;
      version: string;
    }): Promise<void> => {
      const pythonEnv: PythonEnvironmentDTO =
        await PythonService.getEnvironmentWithLibraries(id, version);
      dispatch.pythonEnvironment.setPythonEnvironment(pythonEnv);
    },
    getPythonEnvironmentWithOperations: async ({
      id,
      version,
    }: {
      id: number;
      version: string;
    }): Promise<PythonEnvironmentDTO | APIError> => {
      const pythonEnv: PythonEnvironmentDTO | APIError =
        await PythonService.getEnvironmentWithOperations(id, version);
      dispatch.pythonEnvironment.setPythonEnvironment(pythonEnv);
      return pythonEnv;
    },
    create: async ({
      id,
      version,
    }: {
      id: number;
      version: string;
    }): Promise<PythonEnvironmentDTO> => {
      const pythonEnv: PythonEnvironmentDTO =
        await PythonService.createEnvironment(id, version);
      dispatch.pythonEnvironment.setPythonEnvironment(pythonEnv);
      return pythonEnv;
    },
    edit: async ({ id, data }: { id: number; data: any }): Promise<any> => {
      return PythonService.editEnvironment(id, data);
    },
    delete: async ({
      id,
      version,
    }: {
      id: number;
      version: string;
    }): Promise<any> => {
      await PythonService.deleteEnvironment(id, version);
      dispatch.pythonEnvironment.setPythonEnvironment(undefined);
      dispatch.pythonEnvironment.setPythonEnvironments(undefined);
      dispatch.pythonLibrary.setPythonLibraries(undefined);
      dispatch.pythonConflict.setPythonConflicts(undefined);
    },
    export: async ({
      id,
      version,
    }: {
      id: number;
      version: string;
    }): Promise<any> => {
      return PythonService.exportEnvironment(id, version);
    },
    deleteEnvironmentCommands: async ({
      id,
      version,
    }: {
      id: number;
      version: string;
    }): Promise<void> => {
      await PythonService.deleteEnvironmentCommands(id, version);
    },
    retryEnvironmentCommands: async ({
      id,
      version,
    }: {
      id: number;
      version: string;
    }): Promise<void> => {
      await PythonService.retryEnvironmentCommands(id, version);
    },
  }),
});

export default pythonEnvironment;
