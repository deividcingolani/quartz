import { RootState } from '../../index';
import {
  PythonConflictListDTO,
  PythonEnvironmentDTO,
  PythonEnvironmentListDTO,
  PythonLibraryListDTO,
} from '../../../types/python';
import { ISelectData } from '../../types';
import { APIError } from '../../../types/error';

const selectPythonEnvironments = ({
  pythonEnvironment,
  loading,
}: RootState): ISelectData<
  PythonEnvironmentListDTO | APIError | undefined
> => ({
  data: pythonEnvironment.environments,
  isLoading: loading.effects.pythonEnvironment.getPythonEnvironments,
});

const selectPythonEnvironmentWithLibrariesData = ({
  pythonEnvironment,
  loading,
}: RootState): ISelectData<PythonEnvironmentDTO | undefined> => ({
  data: pythonEnvironment.environment,
  isLoading:
    loading.effects.pythonEnvironment.getPythonEnvironmentWithLibraries,
});

const selectPythonEnvironmentWithOperations = ({
  pythonEnvironment,
  loading,
}: RootState): ISelectData<PythonEnvironmentDTO | APIError | undefined> => ({
  data: pythonEnvironment.environment,
  isLoading:
    loading.effects.pythonEnvironment.getPythonEnvironmentWithOperations,
});

const selectPythonLibrariesWithOperations = ({
  pythonLibrary,
  loading,
}: RootState): ISelectData<PythonLibraryListDTO | APIError | undefined> => ({
  data: pythonLibrary.libraries,
  isLoading: loading.effects.pythonLibrary.getLibrariesWithOperations,
});

// should be in another thing
const selectPythonLibrariesSearch = ({
  pythonLibrary,
  loading,
}: RootState): ISelectData<PythonLibraryListDTO | APIError | undefined> => ({
  data: pythonLibrary.libraries,
  isLoading: loading.effects.pythonLibrary.searchLibraries,
});

const selectPythonConflicts = ({
  pythonConflict,
  loading,
}: RootState): ISelectData<PythonConflictListDTO | APIError | undefined> => ({
  data: pythonConflict.conflicts,
  isLoading: loading.effects.pythonConflict.getPythonConflicts,
});

export {
  selectPythonEnvironments,
  selectPythonEnvironmentWithLibrariesData,
  selectPythonLibrariesWithOperations,
  selectPythonEnvironmentWithOperations,
  selectPythonLibrariesSearch,
  selectPythonConflicts,
};
