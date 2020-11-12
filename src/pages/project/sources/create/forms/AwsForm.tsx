import React, { FC, memo } from 'react';
import { Input } from '@logicalclocks/quartz';
import * as yup from 'yup';

// Utils
import getInputValidation from '../../../../../utils/getInputValidation';
// Default validators
import { alphanum, shortText } from '../../../../../utils/validators';
// Types
import { SourceFormProps } from './types';

export const schema = yup.object().shape({
  name: alphanum.label('Name'),
  description: shortText.label('Description'),
  bucket: shortText.required().label('S3 Bucket'),
  accessKey: shortText.required().label('Access key'),
  secretKey: shortText.required().label('Secret key'),
});

const AwsForm: FC<SourceFormProps> = ({ register, isDisabled, errors }) => (
  <>
    <Input
      label="Name"
      name="name"
      disabled={isDisabled}
      placeholder="name of the source"
      ref={register}
      {...getInputValidation('name', errors)}
    />
    <Input
      label="Description"
      name="description"
      disabled={isDisabled}
      placeholder="description"
      ref={register}
      {...getInputValidation('description', errors)}
    />
    <Input
      labelProps={{ width: '100%' }}
      label="S3 Bucket"
      name="bucket"
      disabled={isDisabled}
      placeholder="https://account_id_or_alias.signin.aws.amazon.com/console/"
      ref={register}
      {...getInputValidation('bucket', errors)}
    />
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
);

export default memo(AwsForm);
