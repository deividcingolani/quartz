import { Box, Flex } from 'rebass';
import { Controller, useFormContext } from 'react-hook-form';
import React, { FC, memo, useCallback } from 'react';
import { Input, Labeling, RadioGroup, Value } from '@logicalclocks/quartz';

// Types
import { TypeFormProps } from '../types';
// Utils
import { isServerBooleanType } from '../utils';
import getInputValidation from '../../../../utils/getInputValidation';

const PrimitiveTypeForm: FC<TypeFormProps> = ({
  type,
  tag,
  name,
  isDisabled,
}) => {
  const { setValue, control, errors, getValues } = useFormContext();

  const isBoolean = isServerBooleanType(type);

  const propertyName = `tags.${tag.name}.${name}`;

  const handleChange = useCallback(
    ({ target: { value } }) => {
      setValue(propertyName, value);
    },
    [setValue, propertyName],
  );

  return (
    <Box mt="20px">
      <Flex mb="5px">
        <Value>
          {name} ({type})
        </Value>
        {!tag.required.includes(name) && (
          <Labeling ml="5px" gray>
            optional
          </Labeling>
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
                  onChange(val === 'True');
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
        />
      )}
    </Box>
  );
};

export default memo(PrimitiveTypeForm);
