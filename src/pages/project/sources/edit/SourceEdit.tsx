import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { FC, useCallback, useEffect } from 'react';
import { TinyPopup, usePopup } from '@logicalclocks/quartz';
// Hooks
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
// Selectors
import { selectFeatureStoreData } from '../../../../store/models/feature/selectors';
// Types
import { SourceProtocol } from '../types';
import { Dispatch, RootState } from '../../../../store';
import { SourcesFormData } from '../forms/types';
// Components
import Loader from '../../../../components/loader/Loader';
import SourcesForm from '../forms/SourcesForm';
// Utils
import {
  formatArguments,
  formatGroups,
  getDtoType,
  protocolOptions,
} from '../utils';
import useTitle from '../../../../hooks/useTitle';
import titles from '../../../../sources/titles';

const SourcesEdit: FC = () => {
  const { connectorName, id: projectId } = useParams();

  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigateRelative();

  const [isPopupOpen, handleToggle] = usePopup();

  const {
    data: featureStoreData,
    isLoading: isFeatureStoreLoading,
  } = useSelector(selectFeatureStoreData);

  useEffect(() => {
    if (projectId && featureStoreData) {
      dispatch.featureStoreSources.fetchOne({
        projectId: +projectId,
        featureStoreId: featureStoreData?.featurestoreId,
        connectorName,
      });
      return () => {
        dispatch.featureStoreSources.clear();
      };
    }
  }, [connectorName, dispatch, projectId, featureStoreData]);

  const isSubmit = useSelector(
    (state: RootState) => state.loading.effects.featureStoreSources.edit,
  );
  const error = useSelector(
    (state: RootState) => state.error.effects.featureStoreSources.edit,
  );

  const [source, ...rest] = useSelector(
    (state: RootState) => state.featureStoreSources,
  );

  // Handlers
  const handleSubmit = useCallback(
    async (data: SourcesFormData) => {
      const {
        protocol: storageConnectorType,
        arguments: args,
        ...restData
      } = data;

      const formattedArgs = formatArguments(args);

      if (featureStoreData?.featurestoreId) {
        dispatch.error.clear({
          name: 'featureStoreSources',
          action: 'edit',
        });
        await dispatch.featureStoreSources.edit({
          projectId: +projectId,
          featureStoreId: featureStoreData?.featurestoreId,
          connectorName,
          data: {
            ...(storageConnectorType === SourceProtocol.jdbc && {
              arguments: formattedArgs,
            }),
            ...(storageConnectorType === SourceProtocol.redshift && {
              databaseGroup: formatGroups(args),
            }),
            type: getDtoType(storageConnectorType),
            ...restData,
          },
        });

        dispatch.featureStoreSources.clear();

        navigate('/storage-connectors', 'p/:id/*');
      }
    },
    [dispatch, navigate, projectId, connectorName, featureStoreData],
  );

  const handleDelete = useCallback(async () => {
    if (featureStoreData?.featurestoreId) {
      dispatch.error.clear({
        name: 'featureStoreSources',
        action: 'delete',
      });
      await dispatch.featureStoreSources.delete({
        projectId: +projectId,
        featureStoreId: featureStoreData?.featurestoreId,
        connectorName,
      });

      dispatch.featureStoreSources.clear();

      navigate('/storage-connectors', 'p/:id/*');
    }
  }, [dispatch, featureStoreData, projectId, navigate, connectorName]);

  useTitle(`${titles.editStorageConnector} - ${source?.name}`);

  if (isFeatureStoreLoading || rest.length || !source) {
    return <Loader />;
  }

  return (
    <>
      <SourcesForm
        error={error}
        isLoading={isSubmit}
        isDisabled={!source}
        onSubmit={handleSubmit}
        isEdit
        initialData={source}
        initialProtocol={
          protocolOptions.getByValue(
            source.storageConnectorType,
          ) as SourceProtocol
        }
        onDelete={handleToggle}
      />
      <TinyPopup
        width="440px"
        title={`Delete ${source.name}`}
        secondaryText="Once you delete a storage connector, there is no going back. Please be certain."
        isOpen={isPopupOpen}
        mainButton={['Delete storage connector', handleDelete]}
        secondaryButton={['Back', handleToggle]}
        onClose={handleToggle}
      />
    </>
  );
};

export default SourcesEdit;
