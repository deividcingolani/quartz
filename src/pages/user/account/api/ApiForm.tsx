import * as yup from 'yup';
import {
  Button,
  Callout,
  CalloutTypes,
  Card,
  CheckboxGroup,
  Input,
  Microlabeling,
  TinyPopup,
  usePopup,
  Value,
} from '@logicalclocks/quartz';
import React, { FC, useCallback } from 'react';
import { Box, Flex } from 'rebass';
import { useDispatch, useSelector } from 'react-redux';
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
import { Dispatch } from '../../../../store';

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

const defaultScope = ['FEATURESTORE', 'PROJECT', 'JOB', 'DATASET_CREATE', 'KAFKA'];

const ApiForm: FC<ApiFormProps> = ({
  isEdit = false,
  isLoading,
  initialData,
  onSubmit,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<Dispatch>();
  const [isPopupOpen, handleToggle] = usePopup();

  const scopes = useSelector(selectScopes);

  const { control, handleSubmit, errors, register } = useForm({
    defaultValues: {
      name: initialData?.name,
      scope: initialData?.scope || defaultScope,
    },
    resolver: yupResolver(schema),
    shouldUnregister: false,
  });

  const handleDelete = useCallback(async () => {
    if (initialData?.name) {
      await dispatch.api.delete(initialData.name);
      handleToggle();
      navigate('/account/api');
    }
  }, [dispatch.api, handleToggle, initialData, navigate]);

  return (
    <>
      <Card
        actions={
          <Button
            mr="-15px"
            onClick={() =>
              window.open(
                'https://docs.hopsworks.ai/latest/integrations/databricks/api_key/',
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
          {isEdit && (
            <Flex mt="20px">
              <Button
                intent="alert"
                onClick={handleToggle}
                disabled={isLoading}
              >
                Delete API key
              </Button>
            </Flex>
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
      {isEdit && (
        <TinyPopup
          width="440px"
          isOpen={isPopupOpen}
          onClose={handleToggle}
          title={`Delete ${initialData?.name}`}
          secondaryButton={['Back', handleToggle]}
          mainButton={['Delete API key', handleDelete]}
          secondaryText="Once you delete an API key, there is no going back. Please be certain."
        />
      )}
    </>
  );
};

export default ApiForm;
