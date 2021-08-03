// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Hooks
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
// Types
import StorageConnectorProtocol from '../types';
import { StorageConnectorsFormData } from '../forms/types';
import { Dispatch, RootState } from '../../../../store';
// Components
import StorageConnectorsForm from '../forms/StorageConnectorsForm';
import Loader from '../../../../components/loader/Loader';
// Utils
import { formatArguments, getDtoType, protocolOptions } from '../utils';
import useTitle from '../../../../hooks/useTitle';
import titles from '../../../../sources/titles';

const StorageConnectorsCreate: FC = () => {
  useTitle(titles.createStorageConnector);

  const { protocol, id: projectId, fsId } = useParams();

  const isSubmit = useSelector(
    (state: RootState) =>
      state.loading.effects.featureStoreStorageConnectors.create,
  );
  const error = useSelector(
    (state: RootState) =>
      state.error.effects.featureStoreStorageConnectors.create,
  );
  const isFeatureStoreLoading = useSelector(
    (state: RootState) => state.loading.effects.featureStores.fetch,
  );

  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigateRelative();

  const initialProtocol = Object.keys(StorageConnectorProtocol).includes(
    String(protocol),
  )
    ? (protocol as StorageConnectorProtocol)
    : undefined;

  // Handlers
  const handleSubmit = useCallback(
    async (data: StorageConnectorsFormData) => {
      const {
        protocol: storageConnectorType,
        arguments: args,
        sfOptions,
        ...restData
      } = data;

      dispatch.error.clear({
        name: 'featureStoreStorageConnectors',
        action: 'create',
      });

      await dispatch.featureStoreStorageConnectors.create({
        projectId: +projectId,
        featureStoreId: +fsId,
        data: {
          // JDBC, REDSHIFT keyvalue (arguments)
          ...([
            StorageConnectorProtocol.jdbc,
            StorageConnectorProtocol.redshift,
          ].includes(storageConnectorType) && {
            arguments: formatArguments(args),
          }),
          // SNOWFLAKE keyvalue (sfOtions)
          ...(storageConnectorType === StorageConnectorProtocol.snowflake && {
            sfOptions,
          }),
          type: getDtoType(storageConnectorType),
          storageConnectorType: protocolOptions.getByKey(storageConnectorType),
          ...restData,
        },
      });

      dispatch.featureStoreStorageConnectors.clear();
      navigate('/storage-connectors', 'p/:id/fs/:fsId/*');
    },
    [dispatch, navigate, projectId, fsId],
  );

  if (isFeatureStoreLoading) {
    return <Loader />;
  }

  return (
    <StorageConnectorsForm
      error={error}
      initialProtocol={initialProtocol}
      isLoading={isSubmit}
      isDisabled={!fsId} // TODO: review if this is necessary
      onSubmit={handleSubmit}
    />
  );
};

export default StorageConnectorsCreate;
