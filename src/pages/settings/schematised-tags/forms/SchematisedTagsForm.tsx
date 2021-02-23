import * as yup from 'yup';
import { Box, Flex } from 'rebass';
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
import { SchematisedTagFormData, SchematisedTagFormProps } from './types';
// Utils
import { name, shortText } from '../../../../utils/validators';
import getInputValidation from '../../../../utils/getInputValidation';
import { mapPropertiesToTable } from '../utils';

export const schema = yup.object().shape({
  name: name.label('Name'),
  description: shortText.label('Description'),
});

const SchematisedTagsForm: FC<SchematisedTagFormProps> = ({
  isDisabled,
  onSubmit,
  isEdit = false,
  initialData,
  error,
}) => {
  const {
    errors,
    register,
    handleSubmit,
    setValue,
    getValues,
    setError,
  } = useForm({
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

  const submitHandler = handleSubmit((data: SchematisedTagFormData) => {
    if (!data.properties.length) {
      setError('properties', { message: 'Add at least one property' });
      return;
    }

    const containsEmptyName = !!data.properties.find(
      ({ row }) => !row[0].columnValue,
    );

    if (containsEmptyName) {
      setError('properties', {
        message: 'Name is required for all properties',
      });
      return;
    }

    onSubmit(data);
  });

  return (
    <Flex mt="10px" flexDirection="column" alignItems="center">
      <Button
        ml="-12px"
        intent="inline"
        alignSelf="flex-start"
        onClick={() => navigate(-1)}
      >
        &#8701; all schema
      </Button>

      {!!error && <Callout content={error} type={CalloutTypes.error} />}
      {!!errors.properties && (
        <Box width="100%" mt="10px" mb="10px">
          <Callout
            type={CalloutTypes.error}
            // @ts-ignore
            content={errors.properties.message}
          />
        </Box>
      )}

      <Card mt="10px" width="100%" title="Create new tag schemas">
        <Flex flexDirection="column">
          <Flex flexDirection="column">
            <Flex>
              <Input
                label="Name"
                name="name"
                disabled={isDisabled}
                placeholder="name of schema"
                ref={register}
                {...getInputValidation('name', errors)}
              />
              <Input
                label="Description"
                name="description"
                disabled={isDisabled}
                optional={true}
                labelProps={{ ml: '20px', flex: 1 }}
                placeholder="description of the schema"
                ref={register}
                {...getInputValidation('description', errors)}
              />
            </Flex>

            <PropertiesForm
              setValue={setValue}
              isEdit={isEdit}
              getValues={getValues}
              isDisabled={isDisabled}
            />
          </Flex>
          <Button
            disabled={isDisabled}
            onClick={submitHandler}
            mt="20px"
            alignSelf="flex-end"
          >
            {isEdit ? 'Save' : 'Create new tag template'}
          </Button>
        </Flex>
      </Card>
    </Flex>
  );
};

export default SchematisedTagsForm;
