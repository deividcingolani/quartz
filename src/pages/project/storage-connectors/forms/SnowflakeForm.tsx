// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useEffect, useState } from 'react';
import {
  Button,
  Callout,
  CalloutTypes,
  IconButton,
  Input,
  Label,
  Labeling,
  RadioGroup,
  Value,
  Tooltip,
  TooltipPositions,
  IconName,
} from '@logicalclocks/quartz';
import * as yup from 'yup';
import { Controller, Ref, useFieldArray } from 'react-hook-form';
import { Box, Flex } from 'rebass';
import { shortText } from '../../../../utils/validators';
import { StorageConnectorFormProps } from './types';
import getInputValidation from '../../../../utils/getInputValidation';
import icons from '../../../../sources/icons';
import { passwordStyles } from './styles';
// Reuse the JDBC styles
import { tooltipProps, argumentRowStyles } from './jdbc-form.styles';

export const schema = yup.object().shape({
  url: shortText.required().label('Connection URL'),
  user: shortText.required().label('user'),
  token: shortText.when('authMethod', {
    is: 'Token',
    then: yup.string().required().label('token'),
  }),
  password: shortText.when('authMethod', {
    is: 'Password',
    then: shortText.required().label('password'),
  }),
  database: shortText.required().label('database'),
  schema: shortText.required().label('schema'),
  sfOptions: yup.array().of(
    yup.object().shape({
      value: shortText.required().label('Value'),
      name: shortText.required().label('Key'),
    }),
  ),
});

type RefElement = React.ReactElement<any, string> & Ref;

const SnowflakeForm: FC<StorageConnectorFormProps> = ({
  register,
  watch,
  control,
  isDisabled,
  errors,
  setValue: setFormValue,
}) => {
  const { authMethod, token, password } = watch([
    'authMethod',
    'token',
    'password',
  ]);

  const [isShowPassword, setIsShow] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sfOptions',
  });

  useEffect(() => {
    if (!fields.length) {
      append({ name: '', value: '' });
    }
    // run only on component mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [append]);

  return (
    <>
      <Input
        labelProps={{ width: '100%' }}
        label="Connection URL"
        name="url"
        disabled={isDisabled}
        placeholder="account_name.snowflakecomputing.com"
        ref={register}
        {...getInputValidation('url', errors)}
      />

      <Input
        label="User"
        name="user"
        disabled={isDisabled}
        placeholder="user"
        labelProps={{ width: '100%' }}
        ref={register}
        {...getInputValidation('user', errors)}
      />

      <Label mt={0} mb="8px">
        Authentication
      </Label>
      <Controller
        control={control}
        name="authMethod"
        defaultValue={token ? 'Token' : 'Password'}
        render={({ onChange, value }) => (
          <RadioGroup
            flexDirection="row"
            mr="30px"
            disabled={isDisabled}
            value={value}
            options={['Password', 'Token']}
            onChange={(val) => {
              const resetField = val === 'Token' ? 'password' : 'token';
              setFormValue(resetField, '');
              onChange(val);
            }}
          />
        )}
      />

      {authMethod === 'Token' ? (
        <Input
          labelProps={{ width: '100%' }}
          label="Token"
          name="token"
          key="token"
          disabled={isDisabled}
          placeholder="AKEAIOFS7EXAMPLE"
          ref={register}
          {...getInputValidation('token', errors)}
        />
      ) : (
        <Input
          label="Password"
          name="password"
          key="password"
          type={isShowPassword ? 'text' : 'password'}
          disabled={isDisabled}
          placeholder="password"
          ref={register}
          labelProps={{ width: '100%' }}
          rightIcon={
            <Box
              onMouseDown={() => setIsShow(true)}
              onMouseUp={() => setIsShow(false)}
              onMouseOut={() => setIsShow(false)}
              sx={passwordStyles(isShowPassword, !password)}
            >
              <Tooltip
                mainText="show password"
                position={TooltipPositions.left}
              >
                <Box>{icons.eye}</Box>
              </Tooltip>
            </Box>
          }
          {...getInputValidation('password', errors)}
        />
      )}

      <Flex my="10px" alignItems="flex-end">
        <Input
          label="Database"
          name="database"
          disabled={isDisabled}
          placeholder="database name"
          ref={register}
          {...getInputValidation('database', errors)}
        />
        <Input
          label="Schema"
          name="schema"
          disabled={isDisabled}
          placeholder="schema name"
          ref={register}
          labelProps={{ ml: '15px' }}
          {...getInputValidation('schema', errors)}
        />
      </Flex>
      <Flex my="10px" alignItems="flex-end">
        <Label
          text="Warehouse"
          action={
            <Labeling gray ml="5px">
              (optional)
            </Labeling>
          }
        >
          <Input
            name="warehouse"
            disabled={isDisabled}
            placeholder="warehouse name"
            ref={register}
            {...getInputValidation('warehouse', errors)}
          />
        </Label>
        <Label
          text="Table"
          ml="15px"
          action={
            <Labeling gray ml="5px">
              (optional)
            </Labeling>
          }
        >
          <Input
            name="table"
            disabled={isDisabled}
            placeholder="table name"
            ref={register}
            {...getInputValidation('table', errors)}
          />
        </Label>
        <Box
          sx={{
            borderColor: 'grayShade3',
            borderStyle: 'solid',
            borderWidth: '0.5px',
            borderRight: 'none',
            borderTop: 'none',
            borderBottom: 'none',
          }}
          ml="15px"
        >
          <Label
            text="Role"
            action={
              <Labeling gray ml="5px">
                (optional)
              </Labeling>
            }
            ml="15px"
          >
            <Input
              name="role"
              disabled={isDisabled}
              placeholder="role identifier"
              ref={register}
              {...getInputValidation('role', errors)}
            />
          </Label>
        </Box>
        <Box
          sx={{
            borderColor: 'grayShade3',
            borderStyle: 'solid',
            borderWidth: '0.5px',
            borderRight: 'none',
            borderTop: 'none',
            borderBottom: 'none',
          }}
          ml="15px"
        >
          <Label
            text="Application"
            action={
              <Labeling gray ml="5px">
                (optional)
              </Labeling>
            }
            ml="15px"
          >
            <Input
              name="application"
              disabled={isDisabled}
              placeholder="application identifier"
              ref={register}
              {...getInputValidation('application', errors)}
            />
          </Label>
        </Box>
      </Flex>

      <Flex mt="10px">
        <Callout
          content={
            <Flex alignItems="center">
              <Value>
                Add additional parameter using custom options by key/value. For
                more information about additional options, see
              </Value>
              <Button
                ml="-10px"
                height="20px"
                pt="3px"
                sx={{
                  fontFamily: 'Inter',
                }}
                fontWeight="bold"
                intent="inline"
                onClick={() =>
                  window.open(
                    'https://docs.snowflake.com/en/user-guide/spark-connector-use.html',
                    '_blank',
                  )
                }
              >
                Snwoflake documentation↗
              </Button>
            </Flex>
          }
          type={CalloutTypes.neutral}
        />
      </Flex>

      {fields.map((item, index) => {
        const sfOptionsError = errors?.sfOptions?.length
          ? errors?.sfOptions[index]
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
              key={`${item.id}.name`}
              name={`sfOptions.${index}.name` as const}
              disabled={isDisabled}
              placeholder="key"
              defaultValue={item.name}
              ref={(el: RefElement) => register(el)}
              {...getInputValidation('name', sfOptionsError)}
            />
            <Input
              label={isFirstItem ? 'Value' : undefined}
              key={`${item.id}.value`}
              name={`sfOptions.${index}.value` as const}
              placeholder="value"
              disabled={isDisabled}
              defaultValue={item.value}
              labelProps={{ ml: '15px' }}
              ref={(el: RefElement) => register(el)}
              {...getInputValidation('value', sfOptionsError)}
            />
            {fields.length - 1 === index ? (
              <IconButton
                type="button"
                tooltipProps={tooltipProps}
                tooltip="Add"
                disabled={isDisabled}
                onClick={() => append({ name: '', value: '' })}
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

export default SnowflakeForm;
