// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useEffect } from 'react';
import { FileSystemExplorer } from '@logicalclocks/quartz';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FileExplorerMode, FileExplorerProps } from './types';
import { RootState } from '../../store';
import Loader from '../loader/Loader';
import getPathAndFileName from '../../pages/project/jobs/utils/getPathAndFileName';
import DatasetService, {
  DatasetType,
} from '../../services/project/DatasetService';

const FileExplorer: FC<FileExplorerProps> = ({
  handleCloseExplorer,
  handleSelectFile,
  mode = FileExplorerMode.oneFile,
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
    DatasetService.download(+id, `${path}/${fileName}`, DatasetType.DATASET);
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
