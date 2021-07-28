import { Dispatch, SetStateAction } from 'react';

export interface FileExplorerProps {
  handleCloseExplorer: Dispatch<SetStateAction<any>>;
  handleSelectFile?: (activeFile: any, isDownload: boolean) => void;
  mode?: string;
  activeFile?: any;
  activeFolder?: any;
  title?: string;
}

export enum FileExplorerMode {
  oneFile = 'oneFile',
  nFiles = 'nFiles',
  oneFolder = 'oneFolder',
}

export enum FileExplorerOptions {
  app = 'activeApp',
  archives = 'additionalArchives',
  jars = 'additionalJars',
  python = 'additionalPython',
  files = 'additionalFiles',
}

export interface UploadFiles {
  id: string;
  name: string;
  path: string;
  fromFile: string;
  extension: string;
}
