import { FileExplorerDatasetItem } from '../../types/file-explorer-dataset';
import BaseApiService, { RequestType } from '../BaseApiService';

class FileExplorerDatasetService extends BaseApiService {
  getList = (projectId: number, path: string) =>
    this.request<GetFileExplorerDatasets>({
      url: `${projectId}/dataset${path}/?action=listing&expand=inodes&offset=0&limit=1000&sort_by=ID:asc&type=DATASET`,
      type: RequestType.get,
    });
}

export default new FileExplorerDatasetService('/project');

export interface GetFileExplorerDatasets {
  count: number;
  href: string;
  items: FileExplorerDatasetItem[];
  type: string;
}
