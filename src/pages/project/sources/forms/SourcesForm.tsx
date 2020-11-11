import Yup from 'yup';
import { Flex } from 'rebass';
import {
  Card,
  Label,
  Button,
  Callout,
  RadioGroup,
  CalloutTypes,
  StickySummary,
} from '@logicalclocks/quartz';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { FC, memo, useEffect, useMemo, useState } from 'react';

import routeNames from '../../../../routes/routeNames';
// Types
import { SourceProtocol } from '../types';
import { SourcesFormData } from './types';
import { EffectError } from '../../../../store/plugins/errors.plugin';
import { FeatureStoreSource } from '../../../../types/feature-store';
// Components
import Loader from '../../../../components/loader/Loader';
// Styles
import formStyles from './form.styles';
// Utils
import {
  cropText,
  formatStringToArguments,
  getForm,
  getSchema,
  protocolOptions,
} from '../utils';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';

export interface SourcesCreateFormProps {
  error?: EffectError<{ errorMsg: string }>;
  initialProtocol?: SourceProtocol;
  isLoading: boolean;
  isDisabled: boolean;
  onSubmit: (data: SourcesFormData) => void;
  onDelete?: () => void;
  isEdit?: boolean;
  initialData?: FeatureStoreSource;
}

const SourcesForm: FC<SourcesCreateFormProps> = ({
  error,
  initialProtocol = SourceProtocol.aws,
  isLoading,
  isDisabled,
  onSubmit,
  onDelete,
  isEdit,
  initialData,
}) => {
  const navigate = useNavigateRelative();

  const [schema, setSchema] = useState<Yup.ObjectSchema>(
    getSchema(initialProtocol),
  );

  const {
    watch,
    control,
    errors,
    register,
    setValue,
    clearErrors,
    handleSubmit,
  } = useForm({
    defaultValues: {
      bucket: '',
      connectionString: '',
      protocol: initialProtocol,
      ...initialData,
      ...(initialData?.arguments
        ? { arguments: formatStringToArguments(initialData.arguments) }
        : {}),
    } as SourcesFormData,
    shouldUnregister: false,
    resolver: yupResolver(schema),
  });

  const { name, protocol, bucket, connectionString } = watch([
    'name',
    'protocol',
    'bucket',
    'connectionString',
  ]);

  const description = useMemo(
    () => (protocol === SourceProtocol.aws ? bucket : connectionString),
    [protocol, bucket, connectionString],
  );

  const Form = useMemo(() => getForm(protocol), [protocol]);

  useEffect(() => {
    if (!isEdit) {
      setValue('name', '');
      setValue('connectionString', '');
    }

    clearErrors();
    setSchema(getSchema(protocol));
  }, [protocol, setValue, clearErrors, isEdit]);

  return (
    <Card title={isEdit ? 'Edit a source' : 'Create a source'}>
      <Flex sx={formStyles} flexDirection="column">
        {/* API Error Messages */}
        {error && (
          <Callout
            type={CalloutTypes.error}
            content="Can’t connect to the server. Check your URL and credentials."
          />
        )}

        {/* Protocol Radio control */}
        <Label text="Protocol" mt={0} mb="20px">
          <Controller
            control={control}
            name="protocol"
            render={({ onChange, value }) => (
              <RadioGroup
                flexDirection="row"
                mr="30px"
                disabled={isEdit || isLoading}
                value={protocolOptions.getByKey(value)}
                options={protocolOptions.labels}
                onChange={(val) => onChange(protocolOptions.getByValue(val))}
              />
            )}
          />
        </Label>

        {/* Form Section */}
        <Form
          errors={errors}
          key="form"
          register={register}
          control={control}
          isDisabled={isLoading || isDisabled}
        />

        {/* Submit Section */}

        {isEdit && onDelete && (
          <Label text="Danger zone" width="fit-content" mt={0}>
            <Button
              intent="alert"
              disabled={isLoading || isDisabled}
              onClick={onDelete}
            >
              Delete the source
            </Button>
          </Label>
        )}
        <StickySummary
          title={cropText(name, 24)}
          firstValue={cropText(description, 50)}
          mainButton={
            <Button
              disabled={isLoading || isDisabled}
              intent="primary"
              onClick={handleSubmit(onSubmit)}
            >
              {isEdit ? 'Edit Source' : 'Create New Source'}
            </Button>
          }
          secondaryButton={
            <Button
              type="button"
              disabled={isLoading}
              intent="secondary"
              onClick={() =>
                navigate(routeNames.source.list, routeNames.project.view)
              }
            >
              Back to sources
            </Button>
          }
        />
      </Flex>

      {isLoading && <Loader />}
    </Card>
  );
};

export default memo(SourcesForm);
