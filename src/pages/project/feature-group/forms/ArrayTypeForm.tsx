// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo, useEffect } from 'react';
import { Box, Flex } from 'rebass';
import {
  Icon,
  IconButton,
  IconName,
  Input,
  Labeling,
  RadioGroup,
  Tooltip,
  Value,
} from '@logicalclocks/quartz';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

// Types
import { TypeFormProps } from '../types';
// Utils
import { isServerBooleanType } from '../utils';
import getInputValidation from '../../../../utils/getInputValidation';

const ArrayTypeForm: FC<TypeFormProps> = ({
  tag,
  itemType,
  name,
  isDisabled,
  description,
}) => {
  const isBoolean = isServerBooleanType(itemType);

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
    <Box>
      <Flex mb="5px">
        <Value>
          {name}: array of {itemType}
        </Value>
        {!tag.required.includes(name) && (
          <Labeling ml="5px" gray>
            optional
          </Labeling>
        )}
        {!!description && (
          <Tooltip mainText={description} ml="5px">
            <Icon icon="info-circle" size="sm" />
          </Tooltip>
        )}
      </Flex>

      {fields.map((item, index) => {
        const argumentsError = (((errors.tags || {})[tag.name] || {})[name] ||
          [])[index];
        const isLastItem = index === fields.length - 1;

        return (
          <Flex key={item.id} mt="8px" alignItems="flex-end">
            {isBoolean ? (
              <Box mt="10px" mb="5px">
                <Controller
                  control={control}
                  name={`${propertyName}[${index}].value`}
                  render={({ onChange, value }) => (
                    <RadioGroup
                      flexDirection="row"
                      mr="20px"
                      value={value ? 'True' : 'False'}
                      onChange={(val) => {
                        const normVal = val === 'True';
                        onChange(normVal);
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
                intent="ghost"
                tooltip="Remove"
                onClick={() => remove(index)}
                icon={IconName.cross}
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
                icon={IconName.plus}
              />
            )}
          </Flex>
        );
      })}
    </Box>
  );
};

export default memo(ArrayTypeForm);
