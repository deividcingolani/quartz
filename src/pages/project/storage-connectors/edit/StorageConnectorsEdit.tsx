// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { TinyPopup, usePopup } from '@logicalclocks/quartz';
// Hooks
import useTitle from '../../../../hooks/useTitle';
// Types
import StorageConnectorProtocol from '../types';
import { Dispatch, RootState } from '../../../../store';
import { StorageConnectorsFormData } from '../forms/types';
// Components
import Loader from '../../../../components/loader/Loader';
import StorageConnectorsForm from '../forms/StorageConnectorsForm';
// Utils
import { formatArguments, getDtoType, protocolOptions } from '../utils';
import titles from '../../../../sources/titles';
import getHrefNoMatching from '../../../../utils/getHrefNoMatching';
import routeNames from '../../../../routes/routeNames';

const StorageConnectorsEdit: FC = () => {
  const { connectorName, id: projectId, fsId } = useParams();

  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigate();

  const [isPopupOpen, handleToggle] = usePopup();

  useEffect(() => {
    if (projectId) {
      dispatch.featureStoreStorageConnectors.fetchOne({
        projectId: +projectId,
        featureStoreId: +fsId,
        connectorName,
      });
      return () => {
        dispatch.featureStoreStorageConnectors.clear();
      };
    }
    return undefined;
  }, [connectorName, dispatch, projectId, fsId]);

  const isSubmit = useSelector(
    (state: RootState) =>
      state.loading.effects.featureStoreStorageConnectors.edit,
  );
  const error = useSelector(
    (state: RootState) =>
      state.error.effects.featureStoreStorageConnectors.edit,
  );

  const [storageConnector, ...rest] = useSelector(
    (state: RootState) => state.featureStoreStorageConnectors,
  );

  // Handlers
  const handleSubmit = useCallback(
    async (data: StorageConnectorsFormData) => {
      const {
        protocol: storageConnectorType,
        arguments: args,
        sfOptions,
        ...restData
      } = data;

      const formattedArgs = formatArguments(args);

      dispatch.error.clear({
        name: 'featureStoreStorageConnectors',
        action: 'edit',
      });

      await dispatch.featureStoreStorageConnectors.edit({
        projectId: +projectId,
        featureStoreId: +fsId,
        connectorName,
        data: {
          // JDBC, REDSHIFT keyvalue (arguments)
          ...([
            StorageConnectorProtocol.jdbc,
            StorageConnectorProtocol.redshift,
          ].includes(storageConnectorType) && {
            arguments: formattedArgs,
          }),
          // SNOWFLAKE keyvalue (sfOtions)
          ...(storageConnectorType === StorageConnectorProtocol.snowflake && {
            sfOptions,
          }),
          type: getDtoType(storageConnectorType),
          ...restData,
        },
      });

      dispatch.featureStoreStorageConnectors.clear();

      navigate(
        getHrefNoMatching(
          routeNames.storageConnector.list,
          routeNames.project.value,
          true,
          { id: projectId, fsId },
        ),
      );
    },
    [dispatch, navigate, projectId, connectorName, fsId],
  );

  const handleDelete = useCallback(async () => {
    dispatch.error.clear({
      name: 'featureStoreStorageConnectors',
      action: 'delete',
    });
    await dispatch.featureStoreStorageConnectors.delete({
      projectId: +projectId,
      featureStoreId: +fsId,
      connectorName,
    });

    dispatch.featureStoreStorageConnectors.clear();

    navigate(
      getHrefNoMatching(
        routeNames.storageConnector.list,
        routeNames.project.value,
        true,
        { id: projectId, fsId },
      ),
    );
  }, [dispatch, fsId, projectId, navigate, connectorName]);

  useTitle(`${titles.editStorageConnector} - ${storageConnector?.name}`);

  if (rest.length || !storageConnector) {
    return <Loader />;
  }

  return (
    <>
      <StorageConnectorsForm
        error={error}
        isLoading={isSubmit}
        isDisabled={!storageConnector}
        onSubmit={handleSubmit}
        isEdit
        initialData={storageConnector}
        initialProtocol={
          protocolOptions.getByValue(
            storageConnector.storageConnectorType,
          ) as StorageConnectorProtocol
        }
        onDelete={handleToggle}
      />
      <TinyPopup
        width="440px"
        title={`Delete ${storageConnector.name}`}
        secondaryText="Once you delete a storage connector, there is no going back. Please be certain."
        isOpen={isPopupOpen}
        mainButton={['Delete storage connector', handleDelete]}
        secondaryButton={['Back', handleToggle]}
        onClose={handleToggle}
      />
    </>
  );
};

export default StorageConnectorsEdit;
