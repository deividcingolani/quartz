// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { ChangeEvent, FC, useState } from 'react';
import * as yup from 'yup';
import { Flex } from 'rebass';
import { Input, IconButton } from '@logicalclocks/quartz';
import { useFieldArray } from 'react-hook-form';

// Utils
import getInputValidation from '../../../../utils/getInputValidation';
// Default validators
import { name, shortText } from '../../../../utils/validators';
// Types
import { StorageConnectorFormProps } from './types';
// Styles
import { tooltipProps, argumentRowStyles } from './jdbc-form.styles';

export const schema = yup.object().shape({
  name: name.label('Name'),
  description: shortText.label('Description'),
  connectionString: shortText.required().label('S3 Bucket'),
  arguments: yup.array().of(
    yup.object().shape({
      value: shortText.required().label('Value'),
      key: shortText.required().label('Key'),
    }),
  ),
});

const JdbcForm: FC<StorageConnectorFormProps> = ({
  register,
  isDisabled,
  errors,
  control,
}) => {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'arguments',
  });

  return (
    <>
      <Input
        labelProps={{ width: '100%' }}
        label="Connection URL"
        name="connectionString"
        disabled={isDisabled}
        placeholder="jdbc:derby:[subsubprotocol:][databaseName][;attribute=value]*"
        ref={register}
        {...getInputValidation('connectionString', errors)}
      />
      {fields.map((item, index) => {
        const argumentsError = errors?.arguments?.length
          ? errors?.arguments[index]
          : {};
        const isFirstItem = !index;

        return (
          <Flex
            sx={argumentRowStyles}
            key={item.id}
            my="10px"
            alignItems="flex-end"
          >
            <Input
              label={isFirstItem ? 'Key' : undefined}
              name={`arguments[${index}].key`}
              disabled={isDisabled}
              placeholder="key"
              defaultValue={item.key}
              ref={register}
              {...getInputValidation('key', argumentsError)}
            />
            <Input
              label={isFirstItem ? 'Value' : undefined}
              name={`arguments[${index}].value`}
              placeholder="value"
              disabled={isDisabled}
              defaultValue={item.value}
              labelProps={{ ml: '15px' }}
              ref={register}
              {...getInputValidation('value', argumentsError)}
            />
            <IconButton
              type="button"
              disabled={isDisabled}
              tooltipProps={tooltipProps}
              tooltip="Remove"
              onClick={() => remove(index)}
              icon="minus"
            />
          </Flex>
        );
      })}
      <Flex sx={argumentRowStyles} my="10px" alignItems="flex-end">
        <Input
          label={!fields.length ? 'Key' : undefined}
          name={undefined}
          value={key}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            setKey(target.value)
          }
          disabled={isDisabled}
          placeholder="key"
        />
        <Input
          label={!fields.length ? 'Value' : undefined}
          value={value}
          name={undefined}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) => {
            setValue(target.value);
          }}
          placeholder="value"
          disabled={isDisabled}
          labelProps={{ ml: '15px' }}
        />
        <IconButton
          type="button"
          tooltipProps={tooltipProps}
          tooltip="Add"
          disabled={isDisabled}
          onClick={() => {
            append({ key, value });
            setValue('');
            setKey('');
          }}
          icon="plus"
        />
      </Flex>
    </>
  );
};

export default JdbcForm;
