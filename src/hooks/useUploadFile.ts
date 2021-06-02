export interface UseUploadFile {
  file: any;
  flowChunkNumber: number;
  flowChunkSize: number;
  flowCurrentChunkSize: number;
  flowFilename: string;
  flowIdentifier: string;
  flowRelativePath: string;
  flowTotalChunks: number;
  flowTotalSize: number;
}

export const useUploadFile = ({}) => {};
