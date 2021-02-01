import * as yup from 'yup';
import { Box, Flex } from 'rebass';
import { useSelector } from 'react-redux';
import React, { FC, memo, useCallback } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import { Controller, FormProvider, useForm } from 'react-hook-form';

// Types
import { TrainingDatasetFormData } from '../types';
import { TrainingDataset } from '../../../../types/training-dataset';
import { ItemDrawerTypes } from '../../../../components/drawer/ItemDrawer';
// Components
import FeaturesForm from './FeaturesForm';
import Loader from '../../../../components/loader/Loader';
import LabelsForm from '../../feature-group/forms/LabelsForm';
import SchematisedTagsForm from '../../feature-group/forms/SchematisedTagsForm';
import FeatureStickySummary from '../../feature-group/forms/FeatureStickySummary';
// Utils
import { mapTags, validateSchema } from '../../feature-group/utils';
import { name, shortText } from '../../../../utils/validators';
import getInputValidation from '../../../../utils/getInputValidation';
// Selectors
import { selectFeatureStoreStorageConnectors } from '../../../../store/models/feature/storageConnectors/selectors';
import { selectSchematisedTags } from '../../../../store/models/schematised-tags/schematised-tags.selectors';
import {
  Button,
  Callout,
  CalloutTypes,
  Card,
  Divider,
  Icon,
  Input,
  Label,
  Labeling,
  Select,
  Tooltip,
  Value,
} from '@logicalclocks/quartz';
import { IStorageConnector } from '../../../../types/storage-connector';
import { RootState } from '../../../../store';
import StatisticConfigurationForm from '../../feature-group/forms/StatisticsConfigurationForm';

const schema = yup.object().shape({
  name: name.label('Name'),
  description: shortText.label('Description'),
});

export interface TrainingDatasetFormProps {
  isEdit?: boolean;
  isLoading: boolean;
  isDisabled: boolean;
  onDelete?: () => void;
  initialData?: TrainingDataset;
  submitHandler: (data: TrainingDatasetFormData) => void;
}

const TrainingDatasetForm: FC<TrainingDatasetFormProps> = ({
  submitHandler,
  isDisabled,
  isLoading,
  isEdit = false,
  onDelete,
  initialData,
}) => {
  const methods = useForm({
    defaultValues: {
      tags: {},
      name: '',
      storage: {} as IStorageConnector,
      keywords: [],
      description: '',
      features: [],
      location: '',
      dataFormat: ['CSV'],
      correlations: false,
      enabled: true,
      histograms: false,
      ...(!!initialData && {
        location: '',
        name: initialData.name,
        tags: mapTags(initialData),
        keywords: initialData.labels,
        dataFormat: initialData.dataFormat,
        description: initialData.description,
        storage: {} as IStorageConnector,
        correlations: initialData.statisticsConfig.correlations,
        enabled: initialData.statisticsConfig.enabled,
        histograms: initialData.statisticsConfig.histograms,
      }),
    },
    shouldUnregister: false,
    resolver: yupResolver(schema),
  });

  const {
    watch,
    errors,
    control,
    register,
    setError,
    clearErrors,
    handleSubmit,
  } = methods;

  const trainingDatasetsNames = useSelector(
    (state: RootState) => state.trainingDatasets,
  ).map(({ name }) => name);

  const { storage, name } = watch(['storage', 'name']);

  const serverTags = useSelector(selectSchematisedTags);

  const { id: projectId } = useParams();
  const navigate = useNavigate();

  const storages = useSelector(selectFeatureStoreStorageConnectors);

  const onSubmit = useCallback(
    handleSubmit(async (data: TrainingDatasetFormData) => {
      let next = await validateSchema(data.tags, serverTags, setError);

      const hasFeatures = !!data.features.length;
      if (!hasFeatures) {
        setError('features', { message: 'Join at least one feature' });
        next = false;
      }

      const storage = data.storage;
      if (!storage.id) {
        setError('features', { message: 'Select storage' });
        next = false;
      }

      if (!next) {
        return;
      }
      submitHandler(data);
    }),
    [setError, serverTags, clearErrors],
  );

  return (
    <FormProvider {...methods}>
      <>
        {!!errors.features && (
          <Box mb="10px">
            <Callout
              type={CalloutTypes.error}
              // @ts-ignore
              content={errors.features.message}
            />
          </Box>
        )}
        {!!errors.storage && (
          <Box mb="10px">
            <Callout
              type={CalloutTypes.error}
              // @ts-ignore
              content={errors.storage.message}
            />
          </Box>
        )}
        <Card
          contentProps={{
            pb: 0,
            overflow: 'unset',
          }}
          title={
            isEdit ? 'Edit Training Dataset' : 'Create New Training Dataset'
          }
          mb="20px"
        >
          <Flex justifyContent="space-between" mb="20px">
            <Input
              name="name"
              ref={register}
              readOnly={isEdit}
              placeholder="name"
              label="Training Dataset Name"
              labelProps={{ width: '170px' }}
              disabled={isLoading || isDisabled}
              {...getInputValidation('name', errors)}
            />
            <Input
              ref={register}
              name="description"
              placeholder="description"
              disabled={isDisabled || isLoading}
              label="Training Dataset Description"
              labelProps={{ ml: '30px', flex: 1 }}
              {...getInputValidation('description', errors)}
            />
          </Flex>

          {trainingDatasetsNames.includes(name) && (
            <Box mt="-10px">
              <Callout
                content="A training dataset already has this name. Creating a new training dataset with the same name will create a new version."
                type={CalloutTypes.warning}
              />
            </Box>
          )}

          <Controller
            control={control}
            name="storage"
            render={({ onChange, value }) => (
              <Flex flexDirection="column">
                <Flex justifyContent="space-between">
                  <Value mt="10px">Storage</Value>
                  <Button
                    mr="-15px"
                    onClick={() =>
                      navigate(`/p/${projectId}/storage-connectors/new`)
                    }
                    intent="inline"
                  >
                    Create a source
                  </Button>
                </Flex>
                <Select
                  label=""
                  mb="20px"
                  width="100%"
                  value={
                    value.name
                      ? [`${value.name} (${value.storageConnectorType})`]
                      : []
                  }
                  disabled={isEdit}
                  options={storages.map(
                    ({ name, storageConnectorType }) =>
                      `${name} (${storageConnectorType})`,
                  )}
                  placeholder="pick a source"
                  onChange={(val) => {
                    const storageName = val[0].slice(0, val[0].indexOf(' '));
                    onChange(storages.find(({ name }) => name === storageName));
                  }}
                />
              </Flex>
            )}
          />

          {storage?.storageConnectorType === 'S3' && (
            <Input
              mb="20px"
              width="100%"
              ref={register}
              name="location"
              label="Location"
              placeholder="location"
              disabled={isDisabled || isLoading}
              labelAction={
                <Flex>
                  <Labeling ml="5px" gray>
                    (optional)
                  </Labeling>
                  <Tooltip
                    mainText="Path within storage connector, e.g. a bucket sub-directory"
                    ml="5px"
                  >
                    <Icon icon="info-circle" size="sm" />
                  </Tooltip>
                </Flex>
              }
            />
          )}

          <Controller
            control={control}
            name="dataFormat"
            render={({ onChange, value }) => (
              <Select
                mb="20px"
                width="100%"
                value={value}
                placeholder=""
                label="Data format"
                disabled={isEdit}
                options={['TF Record', 'CSV', 'Parquet', 'TSV', 'Avro', 'ORC']}
                onChange={(val) => onChange(val)}
              />
            )}
          />

          <Divider mb="15px" mt="-5px" />

          <StatisticConfigurationForm isLoading={isLoading} />

          <Divider mb="15px" ml="-20px" mt="-5px" />

          <SchematisedTagsForm isDisabled={isDisabled} />

          <LabelsForm isDisabled={isDisabled || isLoading} />

          {isEdit && onDelete && (
            <>
              <Divider mb="20px" ml="-20px" mt="20px" />
              <Label text="Danger zone" width="fit-content">
                <Button
                  intent="alert"
                  onClick={onDelete}
                  disabled={isLoading || isDisabled}
                >
                  Delete training dataset
                </Button>
              </Label>
            </>
          )}

          <FeatureStickySummary
            isEdit={isEdit}
            onSubmit={onSubmit}
            type={ItemDrawerTypes.td}
            disabled={isLoading || isDisabled}
          />

          {isLoading && <Loader />}
        </Card>
        <FeaturesForm />
      </>
    </FormProvider>
  );
};

export default memo(TrainingDatasetForm);
