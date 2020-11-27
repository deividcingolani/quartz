import React, { FC, memo, useCallback, useEffect, useMemo } from 'react';
import {
  Button,
  Callout,
  CalloutTypes,
  Card,
  Checkbox,
  CheckboxGroup,
  Input,
  Label,
  Select,
} from '@logicalclocks/quartz';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Box, Flex } from 'rebass';
import * as yup from 'yup';

// Components
import FeaturesForm from './FeaturesForm';
import FeatureStickySummary from './FeatureStickySummary';
import LabelsForm from './LabelsForm';
import Loader from '../../../../components/loader/Loader';
// Types
import {
  FeatureGroupFormData,
  FeatureGroupFormProps,
  TimeTravelType,
} from '../types';
// Utils
import {
  isUpdated,
  mapFeaturesToTable,
  mapStatisticConfigurationToTable,
} from '../utils';
import { name, shortText } from '../../../../utils/validators';
import getInputValidation from '../../../../utils/getInputValidation';
import Divider from '../../../../components/divider/Devider';
import { uppercaseFirst } from '../../../../utils/uppercaseFirst';

const schema = yup.object().shape({
  name: name.label('Name'),
  description: shortText.label('Description'),
});

const FeatureGroupForm: FC<FeatureGroupFormProps> = ({
  submitHandler,
  isDisabled,
  isLoading,
  isEdit = false,
  onDelete,
  initialData,
}) => {
  const {
    watch,
    control,
    errors,
    register,
    handleSubmit,
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      onlineEnabled: false,
      labels: [],
      features: [],
      timeTravelFormat: [TimeTravelType.none],
      statisticConfiguration: [],
      ...(initialData
        ? {
            name: initialData.name,
            timeTravelFormat: [uppercaseFirst(initialData.timeTravelFormat)],
            description: initialData.description,
            onlineEnabled: initialData.onlineEnabled,
            features: mapFeaturesToTable(initialData),
            statisticConfiguration: mapStatisticConfigurationToTable(
              initialData,
            ),
          }
        : {}),
    },
    shouldUnregister: false,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (initialData?.labels) {
      setValue('labels', initialData?.labels);
    }
  }, [initialData, setValue]);

  const onSubmit = useCallback(
    handleSubmit((data: FeatureGroupFormData) => {
      submitHandler(data);
    }),
    [],
  );

  const isUpdatedFunction = useCallback(
    isUpdated(mapFeaturesToTable(initialData)),
    [initialData],
  );

  const { features } = watch(['features']);

  const isUpdatedFeatures = useMemo(() => isUpdatedFunction(features), [
    features,
    isUpdatedFunction,
  ]);

  return (
    <Card
      title={isEdit ? 'Edit Feature Group' : 'Create New Feature Group'}
      mb="100px"
    >
      <Flex justifyContent="space-between" mb="20px">
        <Input
          disabled={isLoading || isDisabled}
          readOnly={isEdit}
          label="Feature Group Name"
          name="name"
          placeholder="name"
          ref={register}
          labelProps={{ width: '170px' }}
          {...getInputValidation('name', errors)}
        />
        <Input
          disabled={isDisabled || isLoading}
          label="Feature Group Description"
          name="description"
          placeholder="description"
          ref={register}
          labelProps={{ ml: '30px', flex: 1 }}
          {...getInputValidation('description', errors)}
        />
      </Flex>

      <Controller
        control={control}
        name="onlineEnabled"
        render={({ onChange, value }) => (
          <Box mb="20px">
            <Checkbox
              mb="20px"
              label="Enable Online Feature Serving for this Feature Group"
              checked={value}
              onChange={() => onChange(!value)}
            />
          </Box>
        )}
      />

      <Controller
        control={control}
        name="timeTravelFormat"
        render={({ onChange, value }) => (
          <Select
            disabled={isEdit}
            width="fit-content"
            mb="20px"
            placeholder=""
            label="Time travel format"
            options={['Hudi', 'None']}
            value={value}
            onChange={(val) => onChange(val)}
          />
        )}
      />

      <Divider mb="15px" ml="-20px" mt="-5px" />

      <Controller
        control={control}
        name="statisticConfiguration"
        render={({ onChange, value }) => (
          <Box mb="20px">
            <CheckboxGroup
              label="Statistic configuration"
              value={value}
              options={['descriptive statistics', 'histograms', 'correlations']}
              onChange={(val) => onChange(val)}
            />
          </Box>
        )}
      />

      <Divider mb="15px" ml="-20px" mt="-5px" />

      <LabelsForm isDisabled={isDisabled || isLoading} control={control} />

      <FeaturesForm
        isEdit={isEdit}
        getValues={getValues}
        setValue={setValue}
        isDisabled={isDisabled || isLoading}
      />

      {isEdit && (
        <Callout
          type={isUpdatedFeatures ? CalloutTypes.warning : CalloutTypes.neutral}
          content={
            isUpdatedFeatures
              ? `Existing features have been updated or deleted, saving changes will create a new version, from ${
                  initialData?.version
                } to ${
                  (initialData?.version || 0) + 1
                }. It won’t affect current and previous versions.`
              : `You are updating version ${initialData?.version} of this feature group. Updating or deleting existing features will create a new version.`
          }
        />
      )}

      {isEdit && onDelete && (
        <>
          <Divider mb="20px" ml="-20px" mt="20px" />
          <Label text="Danger zone" width="fit-content">
            <Button
              intent="alert"
              disabled={isLoading || isDisabled}
              onClick={onDelete}
            >
              Delete feature group
            </Button>
          </Label>
        </>
      )}

      <FeatureStickySummary
        isEdit={isEdit}
        isUpdatedFeatures={isUpdatedFeatures}
        onSubmit={onSubmit}
        watch={watch}
        disabled={isLoading || isDisabled}
      />

      {isLoading && <Loader />}
    </Card>
  );
};

export default memo(FeatureGroupForm);
