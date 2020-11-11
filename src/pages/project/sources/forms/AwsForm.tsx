import React, { FC } from 'react';
import { Icon, Input, Tooltip } from '@logicalclocks/quartz';
import { Flex } from 'rebass';

import * as yup from 'yup';
// Utils
import getInputValidation from '../../../../utils/getInputValidation';
// Default validators
import { name, shortText } from '../../../../utils/validators';
// Types
import { SourceFormProps } from './types';

export const schema = yup.object().shape({
  name: name.label('Name'),
  description: shortText.label('Description'),
  bucket: shortText.required().label('S3 Bucket'),
  accessKey: shortText.required().label('Access key'),
  secretKey: shortText.required().label('Secret key'),
});

const AwsForm: FC<SourceFormProps> = ({ register, isDisabled, errors }) => (
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
        labelProps={{ ml: '20px', width: '100%' }}
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

export default AwsForm;
