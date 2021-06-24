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

export const useUploadFile = (): UseUploadFile => ({
  file: '',
  flowChunkNumber: 0,
  flowChunkSize: 0,
  flowCurrentChunkSize: 0,
  flowFilename: '',
  flowIdentifier: '',
  flowRelativePath: '',
  flowTotalChunks: 0,
  flowTotalSize: 0,
});
