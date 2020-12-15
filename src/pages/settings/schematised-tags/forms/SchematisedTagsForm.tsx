import * as yup from 'yup';
import { Flex } from 'rebass';
import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Callout,
  CalloutTypes,
  Card,
  Input,
} from '@logicalclocks/quartz';

// Components
import PropertiesForm from './PropertiesForm';
// Types
import { SchematisedTagFormProps } from './types';
// Utils
import { name, shortRequiredText } from '../../../../utils/validators';
import getInputValidation from '../../../../utils/getInputValidation';
import { mapPropertiesToTable } from '../utils';

export const schema = yup.object().shape({
  name: name.label('Name'),
  description: shortRequiredText.label('Description'),
});

const SchematisedTagsForm: FC<SchematisedTagFormProps> = ({
  isDisabled,
  onSubmit,
  isEdit = false,
  initialData,
  error,
}) => {
  const { errors, register, handleSubmit, setValue, getValues } = useForm({
    defaultValues: {
      properties: [],
      ...(initialData && {
        name: initialData.name,
        description: initialData.description,
        properties: mapPropertiesToTable(initialData),
      }),
    },
    shouldUnregister: false,
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  return (
    <Flex mt="10px" flexDirection="column" alignItems="center">
      <Button
        ml="-12px"
        intent="inline"
        alignSelf="flex-start"
        onClick={() => navigate(-1)}
      >
        &#8701; all schematised tag templates
      </Button>

      {!!error && <Callout content={error} type={CalloutTypes.error} />}

      <Card mt="10px" width="100%" title="Create new schematised tag template">
        <Flex flexDirection="column">
          <Flex flexDirection="column">
            <Input
              label="Name"
              name="name"
              disabled={isDisabled}
              placeholder="name of the project"
              ref={register}
              {...getInputValidation('name', errors)}
            />
            <Input
              label="Description"
              name="description"
              disabled={isDisabled}
              labelProps={{ mt: '20px', width: '100%' }}
              placeholder="description of the project"
              ref={register}
              {...getInputValidation('description', errors)}
            />

            <PropertiesForm
              setValue={setValue}
              isEdit={isEdit}
              getValues={getValues}
              isDisabled={isDisabled}
            />
          </Flex>
          <Button
            disabled={isDisabled}
            onClick={handleSubmit(onSubmit)}
            mt="20px"
            alignSelf="flex-end"
          >
            {isEdit ? 'Save' : 'Create new schematised tag template'}
          </Button>
        </Flex>
      </Card>
    </Flex>
  );
};

export default SchematisedTagsForm;
