// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { TinyPopup, usePopup } from '@logicalclocks/quartz';
// Hooks
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
// Selectors
import { selectFeatureStoreData } from '../../../../store/models/feature/selectors';
// Types
import StorageConnectorProtocol from '../types';
import { Dispatch, RootState } from '../../../../store';
import { StorageConnectorsFormData } from '../forms/types';
// Components
import Loader from '../../../../components/loader/Loader';
import StorageConnectorsForm from '../forms/StorageConnectorsForm';
// Utils
import { formatArguments, getDtoType, protocolOptions } from '../utils';
import useTitle from '../../../../hooks/useTitle';
import titles from '../../../../sources/titles';

const StorageConnectorsEdit: FC = () => {
  const { connectorName, id: projectId } = useParams();

  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigateRelative();

  const [isPopupOpen, handleToggle] = usePopup();

  const { data: featureStoreData, isLoading: isFeatureStoreLoading } =
    useSelector(selectFeatureStoreData);

  useEffect(() => {
    if (projectId && featureStoreData) {
      dispatch.featureStoreStorageConnectors.fetchOne({
        projectId: +projectId,
        featureStoreId: featureStoreData?.featurestoreId,
        connectorName,
      });
      return () => {
        dispatch.featureStoreStorageConnectors.clear();
      };
    }
    return undefined;
  }, [connectorName, dispatch, projectId, featureStoreData]);

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

      if (featureStoreData?.featurestoreId) {
        dispatch.error.clear({
          name: 'featureStoreStorageConnectors',
          action: 'edit',
        });

        await dispatch.featureStoreStorageConnectors.edit({
          projectId: +projectId,
          featureStoreId: featureStoreData?.featurestoreId,
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

        navigate('/storage-connectors', 'p/:id/*');
      }
    },
    [dispatch, navigate, projectId, connectorName, featureStoreData],
  );

  const handleDelete = useCallback(async () => {
    if (featureStoreData?.featurestoreId) {
      dispatch.error.clear({
        name: 'featureStoreStorageConnectors',
        action: 'delete',
      });
      await dispatch.featureStoreStorageConnectors.delete({
        projectId: +projectId,
        featureStoreId: featureStoreData?.featurestoreId,
        connectorName,
      });

      dispatch.featureStoreStorageConnectors.clear();

      navigate('/storage-connectors', 'p/:id/*');
    }
  }, [dispatch, featureStoreData, projectId, navigate, connectorName]);

  useTitle(`${titles.editStorageConnector} - ${storageConnector?.name}`);

  if (isFeatureStoreLoading || rest.length || !storageConnector) {
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
