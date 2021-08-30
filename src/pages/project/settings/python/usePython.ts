import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectPythonEnvironmentWithLibrariesData,
  selectPythonLibrariesWithOperations,
  selectPythonEnvironmentWithOperations,
  selectPythonLibrariesSearch,
  selectPythonConflicts,
  selectPythonEnvironments,
} from '../../../../store/models/python/python.selectors';
import {
  PythonConflictListDTO,
  PythonEnvironmentDTO,
  PythonEnvironmentListDTO,
  PythonLibraryListDTO,
} from '../../../../types/python';
import { Dispatch } from '../../../../store';
import { ISelectData } from '../../../../store/types';
import { APIError } from '../../../../types/error';
// ------------- ENVIRONMENT
const usePythonEnvironments = (
  projectId: number,
): ISelectData<PythonEnvironmentListDTO | APIError | undefined> => {
  const { data, isLoading } = useSelector(selectPythonEnvironments);
  const dispatch = useDispatch<Dispatch>();
  useEffect(() => {
    if (!isLoading && data === undefined) {
      dispatch.pythonEnvironment.getPythonEnvironments({ id: projectId });
    }
  }, [projectId, dispatch, isLoading, data]);
  return { data, isLoading };
};

// Not used
const usePythonEnvironmentWithLibraries = (
  projectId: number,
  version: string,
): ISelectData<PythonEnvironmentDTO | undefined> => {
  const { data, isLoading } = useSelector(
    selectPythonEnvironmentWithLibrariesData,
  );
  const dispatch = useDispatch<Dispatch>();
  useEffect(() => {
    if (!isLoading && data === undefined) {
      dispatch.pythonEnvironment.getPythonEnvironmentWithLibraries({
        id: projectId,
        version,
      });
    }
  }, [projectId, dispatch, isLoading, data, version]);
  return { data, isLoading };
};

const usePythonEnvironmentWithOperations = (
  projectId: number,
  version: string,
): ISelectData<PythonEnvironmentDTO | APIError | undefined> => {
  const { data, isLoading } = useSelector(
    selectPythonEnvironmentWithOperations,
  );
  const dispatch = useDispatch<Dispatch>();
  useEffect(() => {
    if (!isLoading && data === undefined) {
      dispatch.pythonEnvironment.getPythonEnvironmentWithOperations({
        id: projectId,
        version,
      });
    }
  }, [projectId, dispatch, isLoading, data, version]);
  return { data, isLoading };
};
// ------------- LIBRARIES
const usePythonLibrariesWithOperations = (
  projectId: number,
  version: string,
): ISelectData<PythonLibraryListDTO | APIError | undefined> => {
  const { data, isLoading } = useSelector(selectPythonLibrariesWithOperations);
  const dispatch = useDispatch<Dispatch>();
  useEffect(() => {
    if (!isLoading && data === undefined) {
      dispatch.pythonLibrary.getLibrariesWithOperations({
        id: projectId,
        version,
      });
    }
  }, [projectId, dispatch, isLoading, data, version]);
  return { data, isLoading };
};

// Not used
const usePythonLibrariesSearch = (
  projectId: number,
  version: string,
  searchQuery: string,
  manager: string,
  channel?: string,
): ISelectData<PythonLibraryListDTO | APIError | undefined> => {
  const { data, isLoading } = useSelector(selectPythonLibrariesSearch);
  const dispatch = useDispatch<Dispatch>();
  useEffect(() => {
    if (!isLoading && data === undefined) {
      dispatch.pythonLibrary.searchLibraries({
        id: projectId,
        version,
        searchQuery,
        manager,
        channel,
      });
    }
  }, [
    projectId,
    dispatch,
    isLoading,
    data,
    channel,
    searchQuery,
    manager,
    version,
  ]);
  return { data, isLoading };
};

// ------------- CONFLICTS
const usePythonConflicts = (
  projectId: number,
  version: string,
): ISelectData<PythonConflictListDTO | APIError | undefined> => {
  const { data, isLoading } = useSelector(selectPythonConflicts);
  const dispatch = useDispatch<Dispatch>();
  useEffect(() => {
    if (!isLoading && data === undefined) {
      dispatch.pythonConflict.getPythonConflicts({
        id: projectId,
        version,
      });
    }
  }, [projectId, dispatch, isLoading, data, version]);
  return { data, isLoading };
};

export {
  usePythonEnvironmentWithLibraries,
  usePythonLibrariesWithOperations,
  usePythonEnvironmentWithOperations,
  usePythonLibrariesSearch,
  usePythonConflicts,
  usePythonEnvironments,
};
