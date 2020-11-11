import * as yup from 'yup';
import { Flex } from 'rebass';
import React, { ChangeEvent, FC, useState } from 'react';
import { Input, IconButton, Tooltip, Icon } from '@logicalclocks/quartz';
import { useFieldArray } from 'react-hook-form';

// Utils
import getInputValidation from '../../../../utils/getInputValidation';
// Default validators
import { name, shortText } from '../../../../utils/validators';
// Types
import { SourceFormProps } from './types';
// Styles
import { tooltipProps, argumentRowStyles } from './jdbc-form.styles';

export const schema = yup.object().shape({
  name: name.label('Name'),
  description: shortText.label('Description'),
  connectionString: shortText.required().label('S3 Bucket'),
  arguments: yup.array(
    yup.object({
      value: shortText.required().label('Value'),
      key: shortText.required().label('Key'),
    }),
  ),
});

const JdbcForm: FC<SourceFormProps> = ({
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
      <Flex>
        <Input
          label="Name"
          name="name"
          disabled={isDisabled}
          placeholder="name of the source"
          ref={register}
          labelAction={
            <Tooltip
              mainText="Only alphanumeric characters, dash or underscore"
              ml="5px"
            >
              <Icon icon="info-circle" />
            </Tooltip>
          }
          {...getInputValidation('name', errors)}
        />
        <Input
          labelProps={{ width: '100%', ml: '20px' }}
          label="Description"
          name="description"
          disabled={isDisabled}
          placeholder="description"
          ref={register}
          {...getInputValidation('description', errors)}
        />
      </Flex>
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
          name="key"
          value={key}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            setKey(target.value)
          }
          disabled={isDisabled}
          placeholder="key"
          ref={register}
        />
        <Input
          label={!fields.length ? 'Value' : undefined}
          value={value}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) => {
            setValue(target.value);
          }}
          placeholder="value"
          disabled={isDisabled}
          labelProps={{ ml: '15px' }}
          ref={register}
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
