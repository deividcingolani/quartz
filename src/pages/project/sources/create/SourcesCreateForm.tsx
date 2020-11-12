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
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { FC, memo, useEffect, useMemo, useState } from 'react';

// Types
import { SourceProtocol } from './types';
import { SourcesFormData } from './forms/types';
import { EffectError } from '../../../../store/plugins/errors.plugin';
// Components
import Loader from '../../../../components/loader/Loader';
// Styles
import formStyles from './forms/form.styles';
// Utils
import { getForm, getSchema, protocolOptions } from './utils';

export interface SourcesCreateFormProps {
  error?: EffectError<{ errorMsg: string }>;
  initialProtocol?: SourceProtocol;
  isLoading: boolean;
  isDisabled: boolean;
  onSubmit: (data: SourcesFormData) => void;
}

const SourcesCreateForm: FC<SourcesCreateFormProps> = ({
  error,
  initialProtocol = SourceProtocol.aws,
  isLoading,
  isDisabled,
  onSubmit,
}) => {
  const navigate = useNavigate();

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
      name: '',
      bucket: '',
      connectionString: '',
      protocol: initialProtocol,
    },
    shouldUnregister: false,
    resolver: yupResolver(schema),
  });

  const { name, protocol, bucket, connectionString } = watch([
    'name',
    'protocol',
    'bucket',
    'connectionString',
  ]);

  const Form = useMemo(() => getForm(protocol), [protocol]);

  useEffect(() => {
    setValue('name', '');
    setValue('connectionString', '');

    clearErrors();
    setSchema(getSchema(protocol));
  }, [protocol, setValue, clearErrors]);

  return (
    <Card title="Create a source">
      <Flex
        as="form"
        sx={formStyles}
        flexDirection="column"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* API Error Messages */}
        {error && (
          <Callout
            type={CalloutTypes.error}
            content="Can’t connect to the server. Check your URL and credentials."
          />
        )}

        {/* Protocol Radio control */}
        <Label text="Protocol">
          <Controller
            control={control}
            name="protocol"
            render={({ onChange, value }) => (
              <RadioGroup
                flexDirection="row"
                mr="30px"
                disabled={isLoading}
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
        <StickySummary
          title={name}
          firstValue={connectionString || bucket}
          mainButton={
            <Button
              disabled={isLoading || isDisabled}
              intent="primary"
              type="submit"
            >
              Create New Source
            </Button>
          }
          secondaryButton={
            <Button
              type="button"
              disabled={isLoading}
              intent="secondary"
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
          }
        />
      </Flex>

      {isLoading && <Loader />}
    </Card>
  );
};

export default memo(SourcesCreateForm);
