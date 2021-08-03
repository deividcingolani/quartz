// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Types
import { TrainingDatasetFormData } from '../types';
import { Dispatch, RootState } from '../../../../store';
// Utils
import { dataFormatMap, mapFilters, mapJoins } from '../utils';
// Components
import TrainingDatasetForm from '../forms/TrainingDatasetForm';
// Hooks
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import useTitle from '../../../../hooks/useTitle';
import titles from '../../../../sources/titles';
import TdInfoService from '../../../../services/localStorage/TdInfoService';
import { selectFeatureStoreData } from '../../../../store/models/feature/selectors';

const TrainingDatasetCreate: FC = () => {
  useTitle(titles.createTrainingDataset);

  const { id: projectId, fsId } = useParams();

  const dispatch = useDispatch<Dispatch>();

  const navigate = useNavigateRelative();

  const { id: userId } = useSelector((state: RootState) => state.profile);

  const { data: featureStoreData } = useSelector((state: RootState) =>
    selectFeatureStoreData(state, +fsId),
  );

  useEffect(() => {
    dispatch.schematisedTags.fetch();
    dispatch.featureStoreStorageConnectors.fetch({
      projectId: +projectId,
      featureStoreId: +fsId,
    });
    dispatch.featureGroupLabels.fetch({
      projectId: +projectId,
    });
    dispatch.featureGroups.fetch({
      projectId: +projectId,
      featureStoreId: +fsId,
      needMore: false,
    });
  }, [dispatch, projectId, fsId]);

  const handleSubmit = useCallback(
    async (data: TrainingDatasetFormData) => {
      const {
        dataFormat,
        joins,
        rowFilters,
        correlations,
        histograms,
        enabled,
        storage,
        features,
        ...restData
      } = data;

      dispatch.error.clear({
        name: 'trainingDatasets',
        action: 'create',
      });
      if (featureStoreData?.featurestoreId) {
        const queryDTO = {
          filter: mapFilters(rowFilters),
          ...mapJoins(featureStoreData, joins, features),
        };

        const id = await dispatch.trainingDatasets.create({
          projectId: +projectId,
          featureStoreId: +fsId,
          data: {
            ...restData,
            dataFormat: dataFormatMap.getByKey(dataFormat[0]),
            trainingDatasetType:
              storage.storageConnectorType === 'HOPSFS'
                ? 'HOPSFS_TRAINING_DATASET'
                : 'EXTERNAL_TRAINING_DATASET',
            storageConnector: {
              id: storage.id,
            },
            queryDTO,
            statisticsConfig: {
              columns: [],
              correlations,
              enabled,
              histograms,
            },
          },
        });

        if (id) {
          // Submit the compute job
          // TODO(Fabio): in the future, when we have the job configuration
          // merged, we should redirect the user to configure the job
          // settings.
          dispatch.trainingDatasets.compute({
            projectId: +projectId,
            featureStoreId: +fsId,
            trainingDatasetId: id,
            computeConf: { query: queryDTO },
          });

          dispatch.trainingDatasets.clear();
          dispatch.basket.switch({
            active: false,
            projectId: +projectId,
            userId,
          });
          dispatch.basket.clear({ projectId: +projectId, userId });
          dispatch.search.fetchTd({
            projectId: +projectId,
            featureStoreId: +fsId,
          });

          TdInfoService.delete({
            userId,
            projectId: +projectId,
          });

          navigate(`/${id}`, 'p/:id/fs/:fsId/td/*');
        }
      }
    },
    [dispatch, featureStoreData, fsId, navigate, projectId, userId],
  );

  const isFeatureStoreLoading = useSelector(
    (state: RootState) => state.loading.effects.featureStores.fetch,
  );

  const isSubmit = useSelector(
    (state: RootState) => state.loading.effects.trainingDatasets.create,
  );

  return (
    <>
      <TrainingDatasetForm
        isLoading={isFeatureStoreLoading}
        isDisabled={isSubmit}
        submitHandler={handleSubmit}
      />
    </>
  );
};

export default memo(TrainingDatasetCreate);
