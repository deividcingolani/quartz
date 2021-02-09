import * as yup from 'yup';
import {
  Button,
  Callout,
  CalloutTypes,
  Card,
  CheckboxGroup,
  Input,
  Microlabeling,
  Value,
} from '@logicalclocks/quartz';
import React, { FC } from 'react';
import { Box, Flex } from 'rebass';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// Utils
import { name } from '../../../../utils/validators';
import getInputValidation from '../../../../utils/getInputValidation';
// Selectors
import { selectScopes } from '../../../../store/models/scope/scope.selectors';
// Types
import { Api } from '../../../../types/api';

export interface ApiFormProps {
  isEdit?: boolean;
  isLoading: boolean;
  initialData?: Api;
  onSubmit: (data: APIFormData) => void;
}

export interface APIFormData {
  name: string;
  scope: string[];
}

const schema = yup.object().shape({
  name: name.label('Name'),
});

const defaultScope = ['FEATURESTORE', 'PROJECT', 'JOB'];

const ApiForm: FC<ApiFormProps> = ({
  isEdit = false,
  isLoading,
  initialData,
  onSubmit,
}) => {
  const navigate = useNavigate();

  const scopes = useSelector(selectScopes);

  const { control, handleSubmit, errors, register } = useForm({
    defaultValues: {
      name: initialData?.name,
      scope: initialData?.scope || defaultScope,
    },
    resolver: yupResolver(schema),
    shouldUnregister: false,
  });

  return (
    <Card
      actions={
        <Button
          mr="-15px"
          onClick={() =>
            window.open(
              'https://docs.hopsworks.ai/integrations/databricks/api_key',
              '_blank',
            )
          }
          intent="inline"
        >
          documentation ↗
        </Button>
      }
      title={isEdit ? 'Edit API key' : 'Create new API key'}
    >
      <Flex flexDirection="column">
        <Flex>
          <Input
            name="name"
            label="Name"
            ref={register}
            readOnly={isEdit}
            disabled={isLoading}
            placeholder="name of the API key"
            {...getInputValidation('name', errors)}
          />
          {isEdit && !!initialData?.prefix && (
            <Box mt="25px" ml="20px">
              <Microlabeling mb="3px" gray>
                API key prefix
              </Microlabeling>
              <Value primary>{initialData.prefix}</Value>
            </Box>
          )}
        </Flex>

        <Controller
          name="scope"
          control={control}
          render={({ onChange, value }) => (
            <Box mt="20px">
              <CheckboxGroup
                label="Scope"
                value={value}
                options={scopes}
                onChange={(val) => onChange(val)}
              />
            </Box>
          )}
        />

        {!isEdit && (
          <Box mt="20px">
            <Callout
              type={CalloutTypes.neutral}
              content="You can edit scope later"
            />
          </Box>
        )}

        <Flex mt="20px" justifyContent="flex-end">
          <Button
            mr="20px"
            type="button"
            disabled={isLoading}
            intent="secondary"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <Button
            disabled={isLoading}
            intent="primary"
            onClick={handleSubmit(onSubmit)}
          >
            {isEdit ? 'Save' : 'Create API key'}
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
};

export default ApiForm;
