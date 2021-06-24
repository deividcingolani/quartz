// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useEffect } from 'react';
import {
  FileSystemExplorer,
  NotificationsManager,
} from '@logicalclocks/quartz';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FileExplorerMode, FileExplorerProps } from './types';
import { RootState } from '../../store';
import Loader from '../loader/Loader';
import getPathAndFileName from '../../pages/project/jobs/utils/getPathAndFileName';
import DatasetService, {
  DatasetType,
} from '../../services/project/DatasetService';
import NotificationTitle from '../../utils/notifications/notificationBadge';
import NotificationContent from '../../utils/notifications/notificationValue';

const FileExplorer: FC<FileExplorerProps> = ({
  handleCloseExplorer,
  handleSelectFile,
  mode = FileExplorerMode.oneFile,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
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

    DatasetService.getDownloadToken(
      +id,
      `${path}/${fileName}`,
      DatasetType.DATASET,
    )
      .then(({ data }) => {
        window.open(
          `${
            process.env.REACT_APP_API_HOST
          }/project/${id}/dataset/download/with_token/${encodeURIComponent(
            `${path}/${fileName}`,
          )}?token=${data.data.value}&type=${DatasetType.DATASET}`,
          '_blank',
        );
      })
      .catch(({ response }) => {
        NotificationsManager.create({
          isError: true,
          type: <NotificationTitle message="Error downloading the file" />,
          content: <NotificationContent message={response.data.errorMsg} />,
        });
      });
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
