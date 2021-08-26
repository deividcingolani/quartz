// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo, useCallback } from 'react';
import { Box, Flex } from 'rebass';
import { Controller, useFormContext } from 'react-hook-form';

import {
  Icon,
  Input,
  Labeling,
  RadioGroup,
  Tooltip,
  Value,
} from '@logicalclocks/quartz';

// Types
import { TypeFormProps } from '../types';
// Utils
import {
  backendTagTypeToFrontEndTageType,
  isFloatType,
  isIntType,
  isServerBooleanType,
} from '../utils';
import getInputValidation from '../../../../utils/getInputValidation';

const PrimitiveTypeForm: FC<TypeFormProps> = ({
  type,
  tag,
  name,
  description,
  isDisabled,
}) => {
  const { setValue, control, errors, getValues } = useFormContext();

  const isBoolean = isServerBooleanType(type);
  const isFloat = isFloatType(type);
  const isInt = isIntType(type);

  const propertyName = `tags.${tag.name}.${name}`;

  const handleChange = useCallback(
    ({ target: { value } }) => {
      let typedValue = value;
      if (isFloat) typedValue = parseFloat(value);
      if (isInt) typedValue = parseInt(value, 10);
      setValue(propertyName, typedValue);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setValue, propertyName],
  );

  return (
    <Box>
      <Flex mb="8px">
        <Value>
          {name}: {backendTagTypeToFrontEndTageType(String(type))}
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
      {isBoolean ? (
        <Box mt="10px">
          <Controller
            control={control}
            name={propertyName}
            render={({ onChange, value }) => (
              <RadioGroup
                flexDirection="row"
                mr="25px"
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
          defaultValue={getValues(propertyName)}
          placeholder="enter the value"
          onChange={handleChange}
          disabled={isDisabled}
          {...getInputValidation(name, (errors.tags || {})[tag.name])}
          type={isFloat || isInt ? 'number' : 'text'}
          step={isFloat ? '0.00000000000000001' : undefined}
        />
      )}
    </Box>
  );
};

export default memo(PrimitiveTypeForm);
