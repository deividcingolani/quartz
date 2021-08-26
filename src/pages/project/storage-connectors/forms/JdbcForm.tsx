// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useEffect } from 'react';
import * as yup from 'yup';
import { Flex } from 'rebass';
import { Input, IconButton, IconName } from '@logicalclocks/quartz';
import { useFieldArray, Ref } from 'react-hook-form';

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

type RefElement = React.ReactElement<any, string> & Ref;

const JdbcForm: FC<StorageConnectorFormProps> = ({
  register,
  isDisabled,
  errors,
  control,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'arguments',
  });

  useEffect(() => {
    if (!fields.length) {
      append({ key: '', value: '' });
    }
    // run only on component mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [append]);

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
              key={`${item.id}.key`}
              name={`arguments.${index}.key` as const}
              disabled={isDisabled}
              placeholder="key"
              defaultValue={item.key}
              ref={(ref: RefElement) => register(ref)}
              {...getInputValidation('key', argumentsError)}
            />
            <Input
              label={isFirstItem ? 'Value' : undefined}
              name={`arguments.${index}.value` as const}
              key={`${item.id}.value`}
              placeholder="value"
              disabled={isDisabled}
              defaultValue={item.value}
              labelProps={{ ml: '15px' }}
              ref={(ref: RefElement) => register(ref)}
              {...getInputValidation('value', argumentsError)}
            />
            {fields.length - 1 === index ? (
              <IconButton
                type="button"
                tooltipProps={tooltipProps}
                tooltip="Add"
                disabled={isDisabled}
                onClick={() => append({ key: '', value: '' })}
                icon={IconName.plus}
              />
            ) : (
              <IconButton
                type="button"
                disabled={isDisabled}
                tooltipProps={tooltipProps}
                tooltip="Remove"
                onClick={() => remove(index)}
                icon={IconName.cross}
              />
            )}
          </Flex>
        );
      })}
    </>
  );
};

export default JdbcForm;
