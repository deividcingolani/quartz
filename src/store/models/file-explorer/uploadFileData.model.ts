import { createModel } from '@rematch/core';
import { FileUploadDataset } from '../../../types/file-explorer-dataset';

export type UploadFileDataState = FileUploadDataset;

const uploadFileData = createModel()({
  state: {} as UploadFileDataState,
  reducers: {
    setData: (
      _: UploadFileDataState,
      payload: UploadFileDataState,
    ): UploadFileDataState => payload,
    clear: (): UploadFileDataState => ({}),
  },
  effects: (dispatch) => ({
    setData: (props) => {
      dispatch.uploadFileData.setData(...props);
    },
  }),
});

export default uploadFileData;
