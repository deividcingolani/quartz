// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useEffect, useMemo } from 'react';
import * as yup from 'yup';
import {
  Button,
  Callout,
  CalloutTypes,
  Card,
  Input,
  Label,
  RadioGroup,
  Select,
} from '@logicalclocks/quartz';
import { Flex } from 'rebass';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// Utils
import { longText, name, shortText } from '../../../../utils/validators';
import getInputValidation from '../../../../utils/getInputValidation';
// Types
import { Dispatch, RootState } from '../../../../store';
import { Secret, SecretsVisibility } from '../../../../types/secrets';
import { Project } from '../../../../types/project';

export interface SecretsFormData {
  name: string;
  secret: string[];
  visibility: SecretsVisibility;
  project?: Project;
}

export interface SecretsFormProps {
  isEdit?: boolean;
  isLoading: boolean;
  initialData?: Secret;
  onSubmit: (data: SecretsFormData) => void;
}

const schema = yup.object().shape({
  name: name.label('Name'),
  secret: longText.required().label('Secret'),
  project: shortText.when('visibility', {
    is: SecretsVisibility.project,
    then: shortText.required().label('Project'),
  }),
});

const SecretsForm: FC<SecretsFormProps> = ({
  isLoading,
  initialData,
  onSubmit,
}) => {
  const navigate = useNavigate();

  const { control, handleSubmit, errors, register, watch } = useForm({
    defaultValues: {
      name: initialData?.name,
      secret: initialData?.secret,
      visibility: initialData?.visibility,
      project: initialData?.project,
    },
    resolver: yupResolver(schema),
    shouldUnregister: false,
  });

  const dispatch = useDispatch<Dispatch>();
  const projects = useSelector((state: RootState) => state.projectsList);

  const formattedProjects = useMemo(() => {
    return projects.reduce((acc: any, p) => {
      acc[p.name] = p.id;
      return acc;
    }, {});
  }, [projects]);

  const onFormSubmit = (data: SecretsFormData) => {
    const payload = {
      ...data,
      project: formattedProjects[data.project as any],
    };
    onSubmit(payload);
  };

  const { visibility } = watch(['visibility']);

  useEffect(() => {
    if (visibility === SecretsVisibility.project) {
      dispatch.projectsList.getProjects();
    }
  }, [dispatch.projectsList, visibility]);

  return (
    <>
      <Card
        actions={
          <Button
            mr="-15px"
            onClick={() =>
              window.open(
                'https://hopsworks.readthedocs.io/en/stable/user_guide/hopsworks/jupyter.html?highlight=secrets#storing-api-key-to-hopsworks',
                '_blank',
              )
            }
            intent="inline"
          >
            documentation ↗
          </Button>
        }
        title="Create new secret"
      >
        <Flex flexDirection="column">
          <Flex mb="20px">
            <Input
              name="name"
              label="Name"
              ref={register}
              disabled={isLoading}
              placeholder="name of the secret"
              {...getInputValidation('name', errors)}
            />
          </Flex>
          <Input
            name="secret"
            label="Secret"
            type="textarea"
            width="100%"
            ref={register}
            disabled={isLoading}
            placeholder="value of the secret"
            {...getInputValidation('secret', errors)}
          />
          <Label mt="20px" mb="8px">
            Visibility
          </Label>
          <Controller
            control={control}
            name="visibility"
            defaultValue={initialData?.visibility || SecretsVisibility.private}
            render={({ onChange, value }) => (
              <RadioGroup
                flexDirection="row"
                mr="20px"
                disabled={isLoading}
                value={value}
                options={Object.values(SecretsVisibility)}
                // additionalTexts={['only you', 'users of the project']}
                onChange={onChange}
              />
            )}
          />
          {visibility === SecretsVisibility.project && (
            <>
              <Controller
                control={control}
                name="project"
                defaultValue=""
                render={({ onChange, value }) => (
                  <Select
                    mt="20px"
                    mb="20px"
                    disabled={isLoading || !(projects?.length > 0)}
                    noDataMessage="no projects available"
                    placeholder="project"
                    label=""
                    listWidth="100%"
                    hasPlaceholder={true}
                    options={Object.keys(formattedProjects)}
                    value={value ? [value] : []}
                    onChange={(val) => onChange(val)}
                    {...getInputValidation('project', errors)}
                  />
                )}
              />
              <Callout
                content="Members of the project will be able to access the secrets"
                type={CalloutTypes.warning}
              />
            </>
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
              onClick={handleSubmit(onFormSubmit)}
            >
              Create secret
            </Button>
          </Flex>
        </Flex>
      </Card>
    </>
  );
};

export default SecretsForm;
