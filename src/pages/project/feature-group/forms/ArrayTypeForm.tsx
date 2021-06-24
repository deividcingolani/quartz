// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo, useEffect } from 'react';
import { Box, Flex } from 'rebass';
import {
  IconButton,
  Input,
  Labeling,
  RadioGroup,
  Value,
} from '@logicalclocks/quartz';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

// Types
import { TypeFormProps } from '../types';
// Utils
import { isServerBooleanType } from '../utils';
import getInputValidation from '../../../../utils/getInputValidation';

const ArrayTypeForm: FC<TypeFormProps> = ({ tag, type, name, isDisabled }) => {
  const isBoolean = isServerBooleanType(type);

  const propertyName = `tags.${tag.name}.${name}`;

  const { register, control, errors, getValues } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: propertyName,
  });

  useEffect(() => {
    if (!getValues(propertyName)) {
      append({ value: isBoolean ? true : '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBoolean]);

  return (
    <Box mt="20px">
      <Flex mb="5px">
        <Value>
          {name} (array of {type})
        </Value>
        {!tag.required.includes(name) && (
          <Labeling ml="5px" gray>
            optional
          </Labeling>
        )}
      </Flex>

      {fields.map((item, index) => {
        const argumentsError = (((errors.tags || {})[tag.name] || {})[name] ||
          [])[index];
        const isLastItem = index === fields.length - 1;

        return (
          <Flex ml="20px" key={item.id} my="10px" alignItems="flex-end">
            {isBoolean ? (
              <Box mt="10px" mb="5px">
                <Controller
                  control={control}
                  name={`${propertyName}[${index}].value`}
                  render={({ onChange, value }) => (
                    <RadioGroup
                      flexDirection="row"
                      mr="25px"
                      value={value ? 'True' : 'False'}
                      onChange={(val) => {
                        onChange(val === 'True');
                      }}
                      options={['True', 'False']}
                    />
                  )}
                />
              </Box>
            ) : (
              <Input
                name={`${propertyName}[${index}].value`}
                disabled={isDisabled}
                placeholder="enter the value"
                defaultValue={item.value}
                ref={register}
                {...getInputValidation('value', argumentsError)}
              />
            )}
            {!isLastItem && (
              <IconButton
                type="button"
                disabled={isDisabled}
                tooltipProps={{ ml: '15px' }}
                tooltip="Remove"
                onClick={() => remove(index)}
                icon="minus"
                mb={argumentsError?.value ? '20px' : 0}
              />
            )}
            {isLastItem && (
              <IconButton
                type="button"
                tooltipProps={{ ml: '15px' }}
                tooltip="Add"
                disabled={isDisabled}
                mb={argumentsError?.value ? '20px' : 0}
                onClick={() => {
                  append({ value: isBoolean ? true : '' });
                }}
                icon="plus"
              />
            )}
          </Flex>
        );
      })}
    </Box>
  );
};

export default memo(ArrayTypeForm);
