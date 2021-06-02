export interface FileExplorerDataset {
  [index: number]: FileExplorerDatasetItem[];
}

export interface FileExplorerDatasetItem {
  type: string;
  href: string;
  zipState: string;
  attributes: {
    accessTime: string;
    dir: boolean;
    group: string;
    id: number;
    modificationTime: string;
    name: string;
    owner: string;
    parentId: number;
    path: string;
    permission: string;
    size: number;
    underConstruction: boolean;
  };
}

export interface FileUploadDataset {
  [index: number]: UploadFileDataItem[];
}

export interface UploadFileDataItem {
  showProgress: boolean;
  counter: number;
  fileSize: number;
  progress: number;
  activeApp: any;
  fileGuid: string;
}
