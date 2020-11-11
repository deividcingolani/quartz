import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { FC, useCallback, useEffect } from 'react';

// Hooks
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
// Selectors
import { selectFeatureStoreData } from '../../../../store/models/feature/selectors';
// Types
import { SourceProtocol } from '../types';
import { SourcesFormData } from '../forms/types';
import { Dispatch, RootState } from '../../../../store';
// Components
import SourcesForm from '../forms/SourcesForm';
import Loader from '../../../../components/loader/Loader';
// Utils
import { formatArguments, getConnectorType, getDtoType } from '../utils';

const SourcesCreate: FC = () => {
  const { protocol, id: projectId } = useParams();

  const isSubmit = useSelector(
    (state: RootState) => state.loading.effects.featureStoreSources.create,
  );
  const error = useSelector(
    (state: RootState) => state.error.effects.featureStoreSources.create,
  );
  const {
    data: featureStoreData,
    isLoading: isFeatureStoreLoading,
  } = useSelector(selectFeatureStoreData);

  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigateRelative();

  const initialProtocol = Object.keys(SourceProtocol).includes(String(protocol))
    ? (protocol as SourceProtocol)
    : undefined;

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
        await dispatch.featureStoreSources.create({
          projectId: +projectId,
          featureStoreId: featureStoreData?.featurestoreId,
          storageConnectorType: getConnectorType(storageConnectorType),
          data: {
            ...(protocol === SourceProtocol.jdbc && {
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
    [protocol, dispatch, navigate, projectId, featureStoreData],
  );

  const handleResetError = useCallback(() => {
    dispatch.error.clear({
      name: 'featureStoreSources',
      action: 'create',
    });
  }, [dispatch]);

  // Effects
  useEffect(
    () => () => {
      handleResetError();
    },
    [handleResetError],
  );

  if (isFeatureStoreLoading) {
    return <Loader />;
  }

  return (
    <SourcesForm
      error={error}
      initialProtocol={initialProtocol}
      isLoading={isSubmit}
      isDisabled={!featureStoreData?.featurestoreId}
      onSubmit={handleSubmit}
    />
  );
};

export default SourcesCreate;
