// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC } from 'react';
// Components
import StorageConnectorListContent from './StorageConnectorListContent';
// Hooks
import useStorageConnectorsData, {
  UseStorageConnectorsData,
} from './useStorageConnectorsData';
import useTitle from '../../../../hooks/useTitle';
import titles from '../../../../sources/titles';
import { SharedDataset } from '../../../../store/models/projects/multistore.model';
import useMultiStoreSelect from '../../../../hooks/useMultiStoreSelect';
// Layouts
import Error404 from '../../../error/404Error';

export interface StorageConnectorListProps {
  sharedFrom: SharedDataset[];
}

const StorageConnectorsList: FC<StorageConnectorListProps> = ({
  sharedFrom,
}) => {
  useTitle(titles.storageConnectors);

  const {
    selectFSValue,
    selectFSOptions,
    handleFSSelectionChange,
    data,
    isLoading,
    invalidFS,
    hasSharedFS,
  } = useMultiStoreSelect<UseStorageConnectorsData>(
    useStorageConnectorsData,
    sharedFrom,
  );

  if (invalidFS) {
    return <Error404 />;
  }

  return (
    <StorageConnectorListContent
      data={data}
      isLoading={isLoading}
      hasSharedFS={hasSharedFS}
      selectedFs={selectFSValue}
      selectFSOpts={selectFSOptions}
      setSelectedFs={handleFSSelectionChange}
    />
  );
};

export default StorageConnectorsList;
