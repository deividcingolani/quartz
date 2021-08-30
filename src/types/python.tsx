export interface PythonEnvironmentDTO {
  type: string;
  href: string;
  commands: PythonCommandListDTO | NonExpandedItem;
  condaChannel: string;
  conflicts: PythonConflictListDTO | NonExpandedItem;
  libraries: PythonLibraryListDTO | NonExpandedItem;
  pythonVersion: string;
  pipSearchEnabled: boolean;
  pythonConflicts: boolean;
}

export interface PythonEnvironmentListDTO {
  type: string;
  href: string;
  count: number;
  items: PythonEnvironmentDTO[];
}

export interface NonExpandedItem {
  href: string;
}

// --------  LIBRARIES

export interface PythonLibraryListDTO {
  type: string;
  href: string;
  count: number;
  items: PythonLibraryDTO[];
}

export interface PythonLibraryDTO {
  type: string;
  href: string;
  channel: string;
  commands: PythonCommandListDTO | NonExpandedItem;
  library: string;
  packageSource: string;
  preinstalled: string;
  version: string;
  latestVersion?: string;
}

// -------- CONFLICTS

// Get Conflicts
export interface PythonConflictListDTO {
  type: string;
  count: number;
  href: string;
  items?: PythonConflictDTO[];
}

// In the list of Get Conflicts
// In the list of conflicts of Get Environment + expand conflict
export interface PythonConflictDTO {
  type: string;
  conflict: string;
  service: string;
}

// --------  COMMANDS

export interface PythonCommandListDTO {
  type: string;
  href: string;
  count: number;
  items: PythonCommandDTO[];
}
export interface PythonCommandDTO {
  type: string;
  href: string;
  errorMessage: string;
  installType: string;
  op: OngoingOperationType;
  status: OngoingOperationStatus;
  subject?: PythonLibraryDTO | PythonEnvironmentDTO;
}

export enum OngoingOperationType {
  SYNC_BASE_ENV = 'SYNC_BASE_ENV',
  IMPORT = 'IMPORT',
  EXPORT = 'EXPORT',
  CREATE = 'CREATE',
  REMOVE = 'REMOVE',
  INSTALL = 'INSTALL',
  UNINSTALL = 'UNINSTALL',
}

export enum OngoingOperationStatus {
  ONGOING = 'ONGOING',
  FAILED = 'FAILED',
  NEW = 'NEW',
}

// -------- LIBRARY SEARCH

export interface PythonLibrarySearchListDTO {
  type: string;
  count: number;
  href: string;
  items: PythonLibrarySearchDTO[];
  library: string; // the query
  status: string;
}

export interface PythonLibrarySearchDTO {
  type: string;
  href: string;
  library: string;
  status: PythonLibrarySearchInstallationStatus;
  versions: PythonLibrarySearchVersionDTO[];
}

export interface PythonLibrarySearchVersionDTO {
  uploadTime: string; // TODO direct conversion?
  version: string;
}

export enum PythonLibrarySearchInstallationStatus {
  INSTALLED = 'Installed',
  NOT_INSTALLED = 'Not Installed',
}
