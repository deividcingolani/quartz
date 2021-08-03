// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useParams } from 'react-router';
import Loader from '../../../../components/loader/Loader';
import useSharedFrom from '../../settings/useSharedFrom';
import StorageConnectorsList from './StorageConnectorsList';

const MultiStoreSCList: FC = () => {
  const { id: pId } = useParams();

  const { data: sharedFrom, isLoading: isSharedLoading } = useSharedFrom(+pId);

  if (!sharedFrom || isSharedLoading) {
    return <Loader />;
  }

  return <StorageConnectorsList sharedFrom={sharedFrom} />;
};

export default MultiStoreSCList;
