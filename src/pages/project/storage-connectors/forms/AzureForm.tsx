import React, { FC } from 'react';
import { Input, Label, RadioGroup } from '@logicalclocks/quartz';
import { Controller } from 'react-hook-form';
import * as yup from 'yup';
// Utils
import getInputValidation from '../../../../utils/getInputValidation';
// Default validators
import { shortText, numInt } from '../../../../utils/validators';
// Types
import { StorageConnectorFormProps } from './types';

export const schema = yup.object().shape({
  generation: numInt.required().label('Generation'),
  directoryId: shortText.required().label('Directory id'),
  applicationId: shortText.required().label('Application id'),
  serviceCredential: shortText.required().label('Service credential'),
  accountName: shortText.required().label('Account name'),
  containerName: shortText.when('generation', {
    is: 2,
    then: shortText.required().label('Container name'),
  }),
});

const AzureForm: FC<StorageConnectorFormProps> = ({
  register,
  watch,
  control,
  isDisabled,
  errors,
  setValue,
}) => {
  const { generation } = watch(['generation']);

  return (
    <>
      <Label mt={0} mb="8px">
        Generation
      </Label>
      <Controller
        control={control}
        name="generation"
        defaultValue="2"
        render={({ onChange, value }) => (
          <RadioGroup
            flexDirection="row"
            mr="30px"
            disabled={isDisabled}
            value={value.toString()}
            options={['1', '2']}
            onChange={(val) => {
              if (val === '1') setValue('containerName', '');
              onChange(val);
            }}
          />
        )}
      />
      <Input
        labelProps={{ width: '100%' }}
        label="Directory id"
        name="directoryId"
        disabled={isDisabled}
        placeholder="31a0889f7-5gh3-2387-a2c8-9r346j89demo"
        ref={register}
        {...getInputValidation('directoryId', errors)}
      />
      <Input
        labelProps={{ width: '100%' }}
        label="Application id"
        name="applicationId"
        disabled={isDisabled}
        placeholder="34j643d4-6jj8-2647-d2d9-7g389l49demo"
        ref={register}
        {...getInputValidation('applicationId', errors)}
      />
      <Input
        labelProps={{ width: '100%' }}
        label="Service credential"
        name="serviceCredential"
        disabled={isDisabled}
        placeholder="service credential key name"
        ref={register}
        {...getInputValidation('serviceCredential', errors)}
      />
      <Input
        labelProps={{ width: '100%' }}
        label="Account name"
        name="accountName"
        disabled={isDisabled}
        placeholder="acount name"
        ref={register}
        {...getInputValidation('accountName', errors)}
      />
      {/* eslint-disable-next-line eqeqeq */}
      {generation == 2 && (
        <Input
          labelProps={{ width: '100%' }}
          label="Container name"
          name="containerName"
          disabled={isDisabled}
          placeholder="container name"
          ref={register}
          {...getInputValidation('containerName', errors)}
        />
      )}
    </>
  );
};

export default AzureForm;
