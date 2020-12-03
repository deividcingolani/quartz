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
  getConnectorType,
  getDtoType,
  protocolOptions,
} from '../utils';

const SourcesEdit: FC = () => {
  const { sourceId, connectorType, id: projectId } = useParams();

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
        sourceId: +sourceId,
        connectorType,
      });
      return () => {
        dispatch.featureStoreSources.clear();
      };
    }
  }, [sourceId, connectorType, dispatch, projectId, featureStoreData]);

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
          connectorId: +sourceId,
          storageConnectorType: getConnectorType(storageConnectorType),
          data: {
            ...(storageConnectorType === SourceProtocol.jdbc && {
              arguments: formattedArgs,
            }),
            type: getDtoType(storageConnectorType),
            ...restData,
          },
        });

        dispatch.featureStoreSources.clear();

        navigate('/sources', 'p/:id/*');
      }
    },
    [dispatch, navigate, projectId, featureStoreData, sourceId],
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
        connectorId: +sourceId,
        storageConnectorType: source.storageConnectorType,
      });

      dispatch.featureStoreSources.clear();

      navigate('/sources', 'p/:id/*');
    }
  }, [dispatch, source, featureStoreData, projectId, navigate, sourceId]);

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
        secondaryText="The source will be definitely deleted"
        isOpen={isPopupOpen}
        mainButton={['Delete the source', handleDelete]}
        secondaryButton={['Back', handleToggle]}
        onClose={handleToggle}
      />
    </>
  );
};

export default SourcesEdit;
