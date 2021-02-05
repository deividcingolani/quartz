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
import { selectSchematisedTags } from '../../../../store/models/schematised-tags/schematised-tags.selectors';
import {
  Button,
  Callout,
  CalloutTypes,
  Card,
  Divider,
  Icon,
  Input,
  Labeling,
  Microlabeling,
  Select,
  Tooltip,
  Value,
} from '@logicalclocks/quartz';
import { RootState } from '../../../../store';
import StatisticConfigurationForm from '../../feature-group/forms/StatisticsConfigurationForm';
import { dataFormatMap } from '../utils';
import StatisticsFeaturesForm from './StatisticsFeaturesForm';
import { IStorageConnector } from '../../../../types/storage-connector';
import { selectFeatureStoreStorageConnectors } from '../../../../store/models/feature/storageConnectors/selectors';

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
        name: initialData.name,
        tags: mapTags(initialData),
        keywords: initialData.labels,
        features: initialData.features,
        dataFormat: initialData.dataFormat,
        description: initialData.description,
        correlations: initialData.statisticsConfig.correlations,
        enabled: initialData.statisticsConfig.enabled,
        histograms: initialData.statisticsConfig.histograms,
        statisticsColumns: initialData.statisticsConfig.columns,
        storage: initialData.storageConnector,
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

  const { storage, name, dataFormat } = watch([
    'storage',
    'name',
    'dataFormat',
  ]);

  const serverTags = useSelector(selectSchematisedTags);

  const { id: projectId } = useParams();
  const navigate = useNavigate();

  const storages = useSelector(selectFeatureStoreStorageConnectors).filter(
    ({ storageConnectorType }) => storageConnectorType !== 'JDBC',
  );

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
            isEdit ? 'Edit training dataset' : 'Create New Training Dataset'
          }
          mb={isEdit ? '100px' : '20px'}
        >
          {!isEdit && (
            <>
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
            </>
          )}

          {isEdit && (
            <Flex mb="20px">
              <Flex flexDirection="column">
                <Microlabeling mb="3px" gray>
                  Name
                </Microlabeling>
                <Value primary>{name}</Value>
              </Flex>
              <Flex flexDirection="column" ml="20px">
                <Microlabeling mb="3px" gray>
                  Storage
                </Microlabeling>
                <Value primary>{storage.name}</Value>
              </Flex>
              <Flex flexDirection="column" ml="20px">
                <Microlabeling mb="3px" gray>
                  Data format
                </Microlabeling>
                <Value primary>
                  {dataFormatMap.getByValue(dataFormat as string)}
                </Value>
              </Flex>
            </Flex>
          )}

          {isEdit && (
            <Box>
              <Input
                optional={true}
                label="Description"
                ref={register}
                name="description"
                placeholder="description"
                disabled={isDisabled || isLoading}
                width="100%"
                mb="20px"
                {...getInputValidation('description', errors)}
              />
            </Box>
          )}

          {!isEdit && (
            <>
              <Controller
                control={control}
                name="storage"
                render={({ onChange, value }) => (
                  <Flex flexDirection="column">
                    <Flex justifyContent="space-between">
                      <Value mt="10px">Storage</Value>
                      <Button
                        mr="-15px"
                        onClick={() => navigate(`/p/${projectId}/sources/new`)}
                        intent="inline"
                      >
                        Create a source
                      </Button>
                    </Flex>
                    <Select
                      label=""
                      mb="20px"
                      listWidth="100%"
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
                        const storageName = val[0].slice(
                          0,
                          val[0].indexOf(' '),
                        );
                        onChange(
                          storages.find(({ name }) => name === storageName),
                        );
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
                    listWidth="100%"
                    placeholder=""
                    label="Data format"
                    disabled={isEdit}
                    options={[
                      'TF Record',
                      'CSV',
                      'Parquet',
                      'TSV',
                      'Avro',
                      'ORC',
                    ]}
                    onChange={(val) => onChange(val)}
                  />
                )}
              />
            </>
          )}

          <Divider mb="15px" mt="-5px" legend="Statistic configuration" />

          <StatisticConfigurationForm isLoading={isLoading} />

          <Divider mb="10px" mt="-5px" legend="Metadata" />

          <SchematisedTagsForm isDisabled={isDisabled} />

          <Box mb={!isEdit ? '20px' : 0}>
            <LabelsForm isDisabled={isDisabled || isLoading} />
          </Box>

          {isEdit && (
            <Box>
              <Divider legend="Features" />
              <StatisticsFeaturesForm />
            </Box>
          )}

          {isEdit && onDelete && (
            <>
              <Divider mt="20px" mb="8px" legend="Danger zone" />
              <Button
                intent="alert"
                onClick={onDelete}
                mb="30px"
                disabled={isLoading || isDisabled}
              >
                Delete training dataset
              </Button>
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
        {!isEdit && <FeaturesForm />}
      </>
    </FormProvider>
  );
};

export default memo(TrainingDatasetForm);
