import React, { ChangeEvent, FC, useEffect, useMemo, useState } from 'react';
import {
  Checkbox,
  Divider,
  IconButton,
  Input,
  Label,
  Labeling,
  RadioGroup,
  Select,
} from '@logicalclocks/quartz';
import { Controller, useFieldArray } from 'react-hook-form';
import { Flex } from 'rebass';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from 'emotion-theming';
// eslint-disable-next-line import/no-unresolved
import { ITheme } from '@logicalclocks/quartz/dist/theme/types';

import * as yup from 'yup';
// Utils
import { Dispatch, RootState } from '../../../../store';
import getInputValidation from '../../../../utils/getInputValidation';
import { selectFeatureStoreData } from '../../../../store/models/feature/selectors';
// Default validators
import { shortText, numInt } from '../../../../utils/validators';
// Types
import { SourceFormProps } from './types';
import { RoleMapping } from '../../../../types/role-mapping';

export const schema = yup.object().shape({
  clusterIdentifier: shortText.required().label('Cluster identifier'),
  tableName: shortText.required().label('Table name'),
  databaseDriver: shortText.required().label('Database driver'),
  databaseEndpoint: shortText.required().label('Database endpoint'),
  databaseName: shortText.required().label('Database name'),
  databasePort: numInt.required().label('Database port'),
  databaseUserName: shortText.when('autoCreate', {
    is: false,
    then: shortText.required().label('Database username'),
  }),
  arguments: yup.array(
    yup.object({
      key: shortText.required().label('Key'),
    }),
  ),
  iamRole: shortText.when('authMethod', {
    is: 'IAM',
    then: shortText.required().label('IAM role'),
  }),
  databasePassword: shortText.when('authMethod', {
    is: 'Password',
    then: shortText.required().label('Password'),
  }),
});

const RedshiftForm: FC<SourceFormProps> = ({
  register,
  watch,
  control,
  isDisabled,
  setValue,
  errors,
}) => {
  const { authMethod, autoCreate } = watch(['authMethod', 'autoCreate']);
  const [key, setKey] = useState('');
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'arguments',
  });
  const { data: featureStoreData } = useSelector(selectFeatureStoreData);
  const roles = useSelector((state: RootState) => state.roleMappings);
  const dispatch = useDispatch<Dispatch>();
  const theme = useTheme<ITheme>();

  useEffect(() => {
    if (authMethod === 'IAM' && featureStoreData?.projectId) {
      dispatch.roleMappings.fetch({
        projectId: featureStoreData.projectId,
      });
    }
    return () => {
      dispatch.roleMappings.clear();
    };
  }, [dispatch.roleMappings, featureStoreData, authMethod]);

  const iamRoles = useMemo(() => {
    return roles.map((ds: RoleMapping) => ds.cloudRole);
  }, [roles]);

  return (
    <>
      <Input
        labelProps={{ width: '100%' }}
        label="Cluster identifier"
        name="clusterIdentifier"
        disabled={isDisabled}
        placeholder="Redshift cluster connection string"
        ref={register}
        {...getInputValidation('clusterIdentifier', errors)}
      />
      <Input
        labelProps={{ width: '100%' }}
        label="Table name"
        name="tableName"
        disabled={isDisabled}
        placeholder="table_name"
        ref={register}
        {...getInputValidation('tableName', errors)}
      />

      {/* Database */}
      <Divider legend="Database" mb="0" />

      <Input
        labelProps={{ width: '100%' }}
        label="Database driver"
        name="databaseDriver"
        disabled={isDisabled}
        placeholder="com.amazon.redshift.jdbc42.driver"
        ref={register}
        {...getInputValidation('databaseDriver', errors)}
      />
      <Input
        labelProps={{ width: '100%' }}
        label="Database endpoint"
        name="databaseEndpoint"
        disabled={isDisabled}
        placeholder="abc123xyz789.us-west-2.redshift.amazonaws.com"
        ref={register}
        {...getInputValidation('databaseEndpoint', errors)}
      />
      <Input
        label="Database name"
        name="databaseName"
        disabled={isDisabled}
        placeholder="database_name"
        ref={register}
        {...getInputValidation('databaseName', errors)}
      />
      <Input
        label="Database port"
        name="databasePort"
        type="number"
        disabled={isDisabled}
        placeholder="5439"
        ref={register}
        {...getInputValidation('databasePort', errors)}
      />
      <Flex mt="20px" mb="20px" flexDirection="row" alignItems="flex-start">
        <Input
          label="Database username"
          name="databaseUserName"
          disabled={isDisabled || autoCreate}
          placeholder="@username"
          ref={register}
          {...getInputValidation('databaseUserName', errors)}
        />
        <Controller
          control={control}
          name="autoCreate"
          defaultValue
          render={({ onChange, value }) => (
            <Checkbox
              marginTop="25px"
              marginLeft="20px"
              label="autocreate"
              checked={value}
              onChange={() => onChange(!value)}
            />
          )}
        />
      </Flex>
      {fields.map((item, index) => {
        const argumentsError = errors?.arguments?.length
          ? errors?.arguments[index]
          : {};
        const isFirstItem = !index;

        return (
          <Label
            key={item.id}
            mt="0 !important"
            text={isFirstItem ? 'Database group' : undefined}
            action={
              isFirstItem && (
                <Labeling gray ml="5px">
                  (optional)
                </Labeling>
              )
            }
          >
            <Flex flexDirection="row" mb="10px" alignItems="flex-end">
              <Input
                name={`arguments[${index}].key`}
                disabled={isDisabled}
                placeholder="enter the key"
                defaultValue={item.key}
                ref={(ref) => register(ref)}
                {...getInputValidation('key', argumentsError)}
              />
              <IconButton
                type="button"
                disabled={isDisabled}
                tooltipProps={{
                  ml: '15px',
                }}
                tooltip="Remove"
                onClick={() => remove(index)}
                icon="minus"
              />
            </Flex>
          </Label>
        );
      })}
      <Label
        mt="0 !important"
        text={!fields.length ? 'Database group' : undefined}
        action={
          !fields.length && (
            <Labeling gray ml="5px">
              (optional)
            </Labeling>
          )
        }
      >
        <Flex flexDirection="row" mb="0px" alignItems="flex-end">
          <Input
            name="key"
            value={key}
            onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
              setKey(target.value)
            }
            disabled={isDisabled}
            placeholder="enter the key"
          />
          <IconButton
            type="button"
            tooltipProps={{
              ml: '15px',
            }}
            tooltip="Add"
            disabled={isDisabled}
            onClick={() => {
              append({ key });
              setKey('');
            }}
            icon="plus"
          />
        </Flex>
      </Label>
      {/* Authentication Method */}
      <Divider legend="Authentication" />
      <Label mb="8px">Authentication method</Label>
      <Controller
        control={control}
        name="authMethod"
        defaultValue="IAM"
        render={({ onChange, value }) => (
          <RadioGroup
            flexDirection="row"
            mr="30px"
            disabled={isDisabled}
            value={value}
            options={['IAM', 'Password']}
            onChange={(val) => {
              setValue(val === 'IAM' ? 'databasePassword' : 'iamRole', '');
              onChange(val);
            }}
          />
        )}
      />

      {/* Authentication method parameters */}
      {authMethod === 'Password' ? (
        <Input
          label="Database Password"
          name="databasePassword"
          disabled={isDisabled}
          placeholder="·····"
          ref={register}
          {...getInputValidation('databasePassword', errors)}
        />
      ) : (
        <Controller
          control={control}
          name="iamRole"
          defaultValue=""
          render={({ onChange, value }) => (
            <Select
              mt="20px"
              noDataMessage="no IAM role defined"
              disabled={isDisabled || !iamRoles || iamRoles?.length === 0}
              width="fit-end"
              placeholder="pick IAM role"
              label="IAM roles"
              options={iamRoles}
              value={value ? [value] : []}
              onChange={(val) => onChange(val)}
              {...getInputValidation('iamRole', errors)}
              labelAction={
                <Flex flexGrow={1} justifyContent="flex-end" margin="-8px">
                  <a
                    href="https://hopsworks.readthedocs.io/en/stable/admin_guide/cloud_role_mapping.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: theme.colors.labels.green }}
                  >
                    how to add IAM role
                  </a>
                </Flex>
              }
            />
          )}
        />
      )}
    </>
  );
};

export default RedshiftForm;
