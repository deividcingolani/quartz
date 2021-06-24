import { RootState } from '../../index';
import { ISelectData } from '../../types';
import { IStorageConnector } from '../../../types/storage-connector';

const selectStorageConnectorData = ({
  storageConnectors,
  loading,
}: RootState): ISelectData<IStorageConnector[]> => {
  return {
    data: storageConnectors,
    isLoading: loading.effects.storageConnectors.fetch,
  };
};

export default selectStorageConnectorData;
