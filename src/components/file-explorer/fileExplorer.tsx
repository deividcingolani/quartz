import React, { FC, useEffect } from 'react';
import { FileSystemExplorer } from '@logicalclocks/quartz';
import { FileExplorerMode, FileExplorerProps } from './types';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import Loader from '../loader/Loader';
import { getPathAndFileName } from '../../pages/project/jobs/utils/getPathAndFileName';
import BaseApiService, { RequestType } from '../../services/BaseApiService';

const FileExplorer: FC<FileExplorerProps> = ({
  handleCloseExplorer,
  handleSelectFile,
  mode = FileExplorerMode.oneFile,
  activeFile,
  title,
}) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch.fileExplorerDataset.fetch({ projectId: id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLoading = useSelector(
    (state: RootState) => state.loading.effects.fileExplorerDataset.fetch,
  );

  const data: any = useSelector(
    (state: RootState) => state.fileExplorerDataset,
  );

  const sortData = data.map((item: any) => {
    return item.sort((a: any) => (a.attributes.dir ? -1 : 1));
  });

  const handleLoadMore = (path: string, columnIndex: number) => {
    dispatch.fileExplorerDataset.fetchMore({
      projectId: id,
      path,
      columnIndex,
    });
  };

  const handleDownloadFile = async (file: any) => {
    const { fileName, path } = getPathAndFileName(file.attributes.path);

    const res = await new BaseApiService().request<{
      data: any;
    }>({
      url: `project/${id}/dataset/download/token/${encodeURIComponent(
        `${path}/${fileName}`,
      )}?type=DATASET`,
      type: RequestType.get,
    });
    if (res) {
      window.open(
        `${
          process.env.REACT_APP_API_HOST
        }/project/${id}/dataset/download/with_token/${encodeURIComponent(
          `${path}/${fileName}`,
        )}?token=${res.data.data.value}&type=DATASET`,
        '_blank',
      );
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <FileSystemExplorer
      title={title}
      data={sortData}
      handleLoadMore={handleLoadMore}
      mode={mode}
      onClose={handleCloseExplorer}
      handleSelectFile={handleSelectFile}
      handleDownloadFile={handleDownloadFile}
    />
  );
};

export default FileExplorer;
