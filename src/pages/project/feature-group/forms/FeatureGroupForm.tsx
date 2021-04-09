import React, { FC, memo, useCallback, useMemo } from 'react';
import {
  Button,
  Callout,
  CalloutTypes,
  Card,
  Checkbox,
  Divider,
  Input,
  Label,
  Select,
} from '@logicalclocks/quartz';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm, FormProvider } from 'react-hook-form';
import { Box, Flex } from 'rebass';
import * as yup from 'yup';

// Components
import FeaturesForm from './FeaturesForm';
import FeatureStickySummary from './FeatureStickySummary';
import LabelsForm from './LabelsForm';
import Loader from '../../../../components/loader/Loader';
import SchematisedTagsForm from './SchematisedTagsForm';
// Types
import {
  ValidationType,
  FeatureGroupFormData,
  FeatureGroupFormProps,
  TimeTravelType,
} from '../types';
// Utils
import {
  validateSchema,
  isUpdated,
  mapFeaturesToTable,
  mapTags,
} from '../utils';
import { name, shortText } from '../../../../utils/validators';
import getInputValidation from '../../../../utils/getInputValidation';
import { uppercaseFirst } from '../../../../utils/uppercaseFirst';
import { useSelector } from 'react-redux';
import { selectSchematisedTags } from '../../../../store/models/schematised-tags/schematised-tags.selectors';
import StatisticConfigurationForm from './StatisticsConfigurationForm';
import useScreenWithScroll from '../../../../hooks/useScreenWithScroll';

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
  const methods = useForm({
    defaultValues: {
      name: '',
      description: '',
      onlineEnabled: false,
      keywords: [],
      features: [],
      timeTravelFormat: [TimeTravelType.none],
      dataValidation: [ValidationType.strict],
      enabled: true,
      correlations: false,
      histograms: false,
      tags: {},
      ...(!!initialData && {
        name: initialData.name,
        timeTravelFormat: [
          uppercaseFirst(initialData.timeTravelFormat) || TimeTravelType.none,
        ],
        validationType: [
          uppercaseFirst(initialData.validationType) || ValidationType.strict,
        ],
        description: initialData.description,
        onlineEnabled: initialData.onlineEnabled,
        features: mapFeaturesToTable(initialData),
        keywords: initialData.labels,
        tags: mapTags(initialData),
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
    control,
    errors,
    register,
    handleSubmit,
    setError,
    clearErrors,
  } = methods;

  const serverTags = useSelector(selectSchematisedTags);
  const onSubmit = useCallback(
    handleSubmit(async (data: FeatureGroupFormData) => {
      const next = await validateSchema(data.tags, serverTags, setError);
      if (!next) {
        return;
      }
      submitHandler(data);
    }),
    [setError, serverTags, clearErrors, submitHandler],
  );

  const isUpdatedFunction = useCallback(
    isUpdated(mapFeaturesToTable(initialData)),
    [initialData],
  );

  const { features } = watch(['features']);

  const ErrorObjKeysLength = Object.keys(errors).length;

  const errorsValue =
    ErrorObjKeysLength === 1
      ? `${ErrorObjKeysLength.toString()} error`
      : ErrorObjKeysLength !== 0
      ? `${ErrorObjKeysLength.toString()} errors`
      : '';

  const isUpdatedFeatures = useMemo(() => isUpdatedFunction(features), [
    features,
    isUpdatedFunction,
  ]);

  const hasScrollOnScreen = useScreenWithScroll();

  return (
    <FormProvider {...methods}>
      <Card
        title={isEdit ? 'Edit Feature Group' : 'Create New Feature Group'}
        mb="100px"
        pb={hasScrollOnScreen ? '75px' : 0}
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
            label="Description"
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
                disabled={isDisabled || isLoading}
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

        <Divider mb="15px" mt="-5px" />

        <StatisticConfigurationForm isLoading={isLoading} />

        <Divider mb="15px" mt="-5px" />

        <Controller
          control={control}
          name="validationType"
          render={({ onChange, value }) => (
            <Select
              width="100%"
              mb="20px"
              placeholder=""
              label="Data validation"
              options={['Strict', 'Warning', 'All', 'None']}
              additionalTexts={[
                'Data validation is performed and data is ingested into feature group is updated only if validation status is "SUCCESS"',
                'Data validation is performed and data is ingested into the feature group only if validation status is "WARNING" or "SUCCESS"',
                'Data validation is performed and data is ingested into the feature group regardless of the validation status',
                'Data validation not performed on feature group',
              ]}
              value={value || ['Strict']}
              onChange={(val) => onChange(val)}
            />
          )}
        />

        <SchematisedTagsForm isDisabled={isDisabled} />

        <LabelsForm isDisabled={isDisabled || isLoading} />

        <FeaturesForm isEdit={isEdit} isDisabled={isDisabled || isLoading} />

        {isEdit && (
          <Callout
            type={
              isUpdatedFeatures ? CalloutTypes.warning : CalloutTypes.neutral
            }
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

        {isLoading && <Loader />}
      </Card>
      <FeatureStickySummary
        isEdit={isEdit}
        isUpdatedFeatures={isUpdatedFeatures}
        onSubmit={onSubmit}
        disabled={isLoading || isDisabled}
        errorsValue={errorsValue}
      />
    </FormProvider>
  );
};

export default memo(FeatureGroupForm);
