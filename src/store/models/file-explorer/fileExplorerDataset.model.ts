import { createModel } from '@rematch/core';
import {
  FileExplorerDataset,
  FileExplorerDatasetItem,
} from '../../../types/file-explorer-dataset';
import FileExplorerDatasetService from '../../../services/project/FileExplorerDatasetService';

export type FileExplorerDatasetState = FileExplorerDataset;

const fileExplorerDataset = createModel()({
  state: [] as FileExplorerDatasetState,
  reducers: {
    setData: (
      _: FileExplorerDatasetState,
      payload: FileExplorerDatasetItem[],
    ): FileExplorerDatasetState => [payload],
    setMoreData: (
      prevState: FileExplorerDatasetState,
      payload: FileExplorerDatasetItem[],
      columnIndex: number,
    ): FileExplorerDatasetState => {
      const copy = JSON.parse(JSON.stringify(prevState));

      return [...copy.slice(0, columnIndex + 1), payload];
    },
    clear: (): FileExplorerDatasetState => [],
  },
  effects: (dispatch) => ({
    fetch: async ({
      projectId,
      path = '',
    }: {
      projectId: number;
      path: string;
    }): Promise<void> => {
      const { data } = await FileExplorerDatasetService.getList(
        projectId,
        path,
      );
      dispatch.fileExplorerDataset.setData(data.items || []);
    },
    fetchMore: async ({
      projectId,
      path,
      columnIndex,
    }: {
      projectId: number;
      path: string;
      columnIndex: number;
    }): Promise<void> => {
      const { data } = await FileExplorerDatasetService.getList(
        projectId,
        path,
      );
      dispatch.fileExplorerDataset.setMoreData(data.items, columnIndex);
    },
  }),
});

export default fileExplorerDataset;
