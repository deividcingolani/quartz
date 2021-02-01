import React, { FC, useEffect, useMemo } from 'react';
import { Input, Label, RadioGroup, Select } from '@logicalclocks/quartz';
import { Controller } from 'react-hook-form';
import { Flex } from 'rebass';
import { useTheme } from 'emotion-theming';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
// eslint-disable-next-line import/no-unresolved
import { ITheme } from '@logicalclocks/quartz/dist/theme/types';
// Utils
import { Dispatch, RootState } from '../../../../store';
import getInputValidation from '../../../../utils/getInputValidation';
import { selectFeatureStoreData } from '../../../../store/models/feature/selectors';
// Default validators
import { shortText } from '../../../../utils/validators';
// Types
import { StorageConnectorFormProps } from './types';
import { RoleMapping } from '../../../../types/role-mapping';

export const schema = yup.object().shape({
  bucket: shortText.required().label('S3 Bucket'),
  accessKey: shortText.when('authMethod', {
    is: 'Access key',
    then: shortText.required().label('Access key'),
  }),
  secretKey: shortText.when('authMethod', {
    is: 'Access key',
    then: shortText.required().label('Secret key'),
  }),
  iamRole: shortText.when('authMethod', {
    is: 'Temporary credentials',
    then: shortText.required().label('IAM role'),
  }),
  serverEncryptionKey: shortText.when('serverEncryptionAlgorithm', {
    is: 'SSE-KMS',
    then: shortText.required().label('ARN key'),
  }),
});

const AwsForm: FC<StorageConnectorFormProps> = ({
  register,
  watch,
  control,
  isDisabled,
  errors,
  setValue,
}) => {
  const { data: featureStoreData } = useSelector(selectFeatureStoreData);
  const roles = useSelector((state: RootState) => state.roleMappings);
  const dispatch = useDispatch<Dispatch>();
  const theme = useTheme<ITheme>();

  const { authMethod, serverEncryptionAlgorithm, iamRole } = watch([
    'authMethod',
    'serverEncryptionAlgorithm',
    'iamRole',
  ]);

  useEffect(() => {
    if (authMethod === 'Temporary credentials' && featureStoreData?.projectId) {
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

  const iamRolesAvailable = iamRoles?.length > 0;

  return (
    <>
      <Input
        labelProps={{ width: '100%' }}
        label="S3 Bucket"
        name="bucket"
        disabled={isDisabled}
        placeholder="https://account_id_or_alias.signin.aws.amazon.com/console/"
        ref={register}
        {...getInputValidation('bucket', errors)}
      />
      <Label mt={0} mb="8px">
        Authentication method
      </Label>
      <Controller
        control={control}
        name="authMethod"
        defaultValue={
          iamRole && iamRole !== '' ? 'Temporary credentials' : 'Access key'
        }
        render={({ onChange, value }) => (
          <RadioGroup
            flexDirection="row"
            mr="30px"
            disabled={isDisabled}
            value={value}
            options={['Temporary credentials', 'Access key']}
            onChange={(val) => {
              const fields =
                val === 'Access key' ? ['iamRole'] : ['accessKey', 'secretKey'];
              fields.forEach((f) => setValue(f, ''));
              onChange(val);
            }}
          />
        )}
      />
      {/* Authentication method parameters */}
      {authMethod === 'Access key' ? (
        <>
          <Input
            label="Access key"
            name="accessKey"
            disabled={isDisabled}
            placeholder="AKIAIOSFODNN7EXAMPLE"
            ref={register}
            {...getInputValidation('accessKey', errors)}
          />
          <Input
            labelProps={{ width: '100%' }}
            label="Secret key"
            name="secretKey"
            disabled={isDisabled}
            placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
            ref={register}
            {...getInputValidation('secretKey', errors)}
          />
        </>
      ) : (
        <Controller
          control={control}
          name="iamRole"
          defaultValue=""
          render={({ onChange, value }) => (
            <Select
              mt="20px"
              noDataMessage="no IAM role defined"
              disabled={isDisabled || !iamRolesAvailable}
              width="fit-end"
              placeholder="pick IAM role"
              label="IAM roles"
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
              options={iamRoles}
              value={value ? [value] : []}
              onChange={(val) => onChange(val)}
              {...getInputValidation('iamRole', errors)}
            />
          )}
        />
      )}
      <Label mt={0} mb="8px">
        S3 server encryption algorithm
      </Label>
      <Controller
        control={control}
        name="serverEncryptionAlgorithm"
        defaultValue={null}
        render={({ onChange, value }) => (
          <RadioGroup
            flexDirection="row"
            mr="30px"
            disabled={isDisabled}
            value={value || 'No encryption'}
            options={['No encryption', 'AES256', 'SSE-KMS']}
            onChange={(val) => {
              onChange(val === 'No encryption' ? null : val);
            }}
          />
        )}
      />
      {serverEncryptionAlgorithm === 'SSE-KMS' && (
        <Input
          labelProps={{ width: '100%' }}
          label="ARN key"
          name="serverEncryptionKey"
          disabled={isDisabled}
          placeholder="arn:partition:service:region:account-id:resource-id"
          ref={register}
          {...getInputValidation('serverEncryptionKey', errors)}
        />
      )}
    </>
  );
};

export default AwsForm;
