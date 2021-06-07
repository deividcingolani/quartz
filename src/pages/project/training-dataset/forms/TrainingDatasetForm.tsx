import * as yup from 'yup';
import { Box, Flex } from 'rebass';
import { useSelector } from 'react-redux';
import React, { FC, memo, useCallback, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import {
  CardSecondary,
  Button,
  Callout,
  CalloutTypes,
  Card,
  Icon,
  Input,
  Labeling,
  Microlabeling,
  Select,
  Tooltip,
  Value,
} from '@logicalclocks/quartz';

// Types
import { TrainingDatasetFormData } from '../types';
import { TrainingDataset } from '../../../../types/training-dataset';
import { ItemDrawerTypes } from '../../../../components/drawer/ItemDrawer';
// Components
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

import { RootState } from '../../../../store';
import StatisticConfigurationForm from '../../feature-group/forms/StatisticsConfigurationForm';
import { dataFormatMap, validateFilters, validateJoins } from '../utils';
import StatisticsFeaturesForm from './StatisticsFeaturesForm';
import { IStorageConnector } from '../../../../types/storage-connector';
import { selectFeatureStoreStorageConnectors } from '../../../../store/models/feature/storageConnectors/selectors';
import SplitsForm from './SplitsForm';
import FeaturesForm from './Features/FeaturesForm';
import useScreenWithScroll from '../../../../hooks/useScreenWithScroll';

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
  const infoTD: { [key: string]: string } | any = localStorage.getItem(
    'TdInfo',
  );

  const methods = useForm({
    defaultValues: {
      tags: infoTD ? JSON.parse(infoTD).tags : {},
      name: infoTD ? JSON.parse(infoTD).name : '',
      storage: infoTD ? JSON.parse(infoTD).storage : ({} as IStorageConnector),
      keywords: infoTD ? JSON.parse(infoTD).keywords : [],
      description: infoTD ? JSON.parse(infoTD).description : '',
      features: [],
      location: '',
      dataFormat: infoTD ? [JSON.parse(infoTD).dataFormat] : ['CSV'],
      correlations: infoTD ? JSON.parse(infoTD).correlations : false,
      enabled: infoTD ? JSON.parse(infoTD).enabled : true,
      splits: [],
      histograms: infoTD ? JSON.parse(infoTD).histograms : false,
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

  const trainingDatasetsNames = useSelector((state: RootState) => {
    return state.trainingDatasets;
  }).map(({ name }) => name);

  const {
    storage,
    name,
    dataFormat,
    description,
    enabled,
    histograms,
    correlations,
    tags,
    keywords,
  } = watch([
    'storage',
    'name',
    'dataFormat',
    'description',
    'enabled',
    'histograms',
    'correlations',
    'tags',
    'keywords',
  ]);

  useEffect(() => {
    if (!isEdit) {
      let infoTD = {
        name,
        description,
        storage,
        dataFormat,
        enabled,
        histograms,
        correlations,
        tags,
        keywords,
      };
      const prevInfoTD = localStorage.getItem('TdInfo');

      if (prevInfoTD) {
        infoTD = { ...JSON.parse(prevInfoTD), ...infoTD };
      }
      localStorage.setItem('TdInfo', JSON.stringify(infoTD));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    description,
    name,
    storage,
    dataFormat,
    enabled,
    histograms,
    correlations,
    tags,
    keywords,
  ]);

  const serverTags = useSelector(selectSchematisedTags);

  const hasScrollOnScreen = useScreenWithScroll();

  const errorsLength = Object.keys(errors).length;

  const errorsValue =
    errorsLength === 1
      ? `${errorsLength.toString()} error`
      : errorsLength !== 0
      ? `${errorsLength.toString()} errors`
      : '';

  const { id: projectId } = useParams();
  const navigate = useNavigate();

  const storages = useSelector(selectFeatureStoreStorageConnectors).filter(
    ({ storageConnectorType }) =>
      storageConnectorType === 'HOPSFS' ||
      storageConnectorType === 'S3' ||
      storageConnectorType === 'ADLS',
  );

  const onSubmit = useCallback(
    handleSubmit(async (data: TrainingDatasetFormData) => {
      let next = await validateSchema(data.tags, serverTags, setError);

      const { storage } = data;
      if (!storage.id) {
        setError('features', { message: 'Select storage' });
        next = false;
      }

      let { splits } = data;

      if (splits.length) {
        if (
          splits.length === 2 &&
          splits.every(({ name, percentage }) => !name && !percentage)
        ) {
          data.splits = [];
          splits = [];
        } else if (
          splits.length === 2 &&
          splits.find(({ name, percentage }) => !name || !percentage)
        ) {
          setError('splits', {
            message: 'At least 2 splits are required to enable the function',
          });
          next = false;
        }

        if (
          splits.length &&
          splits.find(({ name, percentage }) => !name || !percentage)
        ) {
          setError('splits', {
            message: 'Every split requires a name and a value',
          });
          next = false;
        }

        splits.forEach(({ percentage }, index) => {
          if (!Number.isInteger(+percentage)) {
            next = false;
            setError(`splits[${index}].percentage`, {
              message: 'Invalid percentage',
            });
          }
        });

        if (!next) {
          return;
        }

        if (
          splits.length &&
          splits.reduce((acc, { percentage }) => acc + +percentage, 0) !== 100
        ) {
          setError('splits', {
            message: 'The sum of all splits should be 100',
          });
          next = false;
        }
      }

      if (!isEdit && data.features.length === 0) {
        setError('features', { message: 'Join at least one feature' });
        return;
      }

      if (
        !isEdit &&
        !(
          validateJoins(data.features, data.joins, setError) &&
          validateFilters(data.rowFilters, setError)
        )
      ) {
        return;
      }

      if (!next) {
        return;
      }

      submitHandler(data);
      localStorage.removeItem('TdInfo');
    }),
    [setError, serverTags, clearErrors],
  );

  return (
    <FormProvider {...methods}>
      <Box>
        <Card
          contentProps={{
            pb: 0,
            overflow: 'unset',
          }}
          title={
            isEdit ? 'Edit training dataset' : 'Create New Training Dataset'
          }
        >
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

          {!isEdit && (
            <>
              <Flex justifyContent="space-between" mb="20px">
                <Input
                  name="name"
                  ref={register}
                  readOnly={isEdit}
                  placeholder="name"
                  label="Training dataset name"
                  labelProps={{ width: '170px' }}
                  disabled={isLoading || isDisabled}
                  {...getInputValidation('name', errors)}
                />
                <Input
                  ref={register}
                  name="description"
                  placeholder="description"
                  disabled={isDisabled || isLoading}
                  label="Training dataset description"
                  optional={true}
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
                        onClick={() =>
                          navigate(`/p/${projectId}/storage-connectors/new`)
                        }
                        intent="inline"
                      >
                        Create a new storage connector ↗
                      </Button>
                    </Flex>
                    <Select
                      mb="20px"
                      listWidth="100%"
                      width="100%"
                      hasPlaceholder={false}
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
                      placeholder="pick a storage"
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

              {(storage?.storageConnectorType === 'S3' ||
                storage?.storageConnectorType === 'ADLS') && (
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

          <StatisticConfigurationForm isLoading={isLoading} />
        </Card>
        <CardSecondary
          mt="20px"
          contentProps={{
            mt: '-10px',
          }}
          mb="20px"
          title="Metadata"
        >
          <SchematisedTagsForm
            type={ItemDrawerTypes.td}
            isDisabled={isDisabled}
          />
          <Box>
            <LabelsForm isDisabled={isDisabled || isLoading} />
          </Box>
        </CardSecondary>
        {!isEdit && <FeaturesForm isDisabled={isLoading || isDisabled} />}
        {!isEdit && <SplitsForm isDisabled={isLoading || isDisabled} />}
        {isEdit && <StatisticsFeaturesForm />}
        {isEdit && onDelete && (
          <CardSecondary
            mb={hasScrollOnScreen ? '95px' : '95px'}
            title="Danger zone"
          >
            <Button
              intent="alert"
              onClick={onDelete}
              disabled={isLoading || isDisabled}
            >
              Delete training dataset
            </Button>
          </CardSecondary>
        )}
        {isLoading && <Loader />}
        <FeatureStickySummary
          errorsValue={errorsValue}
          isEdit={isEdit}
          onSubmit={onSubmit}
          type={ItemDrawerTypes.td}
          disabled={isLoading || isDisabled}
        />
      </Box>
    </FormProvider>
  );
};

export default memo(TrainingDatasetForm);
