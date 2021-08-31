import { createModel } from '@rematch/core';
import PythonService from '../../../services/project/PythonService';
import { PythonConflictListDTO } from '../../../types/python';
import { APIError } from '../../../types/error';

export type PythonConflictState = StateType;

interface StateType {
  conflicts: PythonConflictListDTO | APIError | undefined;
}

const pythonConflict = createModel()({
  state: { conflicts: undefined } as StateType,
  reducers: {
    setPythonConflicts: (
      _: PythonConflictState,
      payload: PythonConflictListDTO | APIError,
    ): PythonConflictState => {
      return { conflicts: payload };
    },
  },
  effects: (dispatch) => ({
    getPythonConflicts: async ({
      id,
      version,
    }: {
      id: number;
      version: string;
    }): Promise<void> => {
      const pythonConflicts: PythonConflictListDTO | APIError =
        await PythonService.getConflicts(id, version);
      dispatch.pythonConflict.setPythonConflicts(pythonConflicts);
    },
  }),
});

export default pythonConflict;
