import { Box, Flex } from 'rebass';
import {
  Card,
  Button,
  StickySummary,
  Input,
  Tooltip,
  Icon,
  Callout,
  CalloutTypes,
  Label,
} from '@logicalclocks/quartz';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import React, { FC, memo } from 'react';
import * as yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';
// Types
import { ProjectFormData } from './types';
import { Project } from '../../../types/project';
// Utils
import { cropText } from '../storage-connectors/utils';
import { name, shortText } from '../../../utils/validators';
import getInputValidation from '../../../utils/getInputValidation';
// Components
import MembersForm from './MembersForm';
import Loader from '../../../components/loader/Loader';

export interface ProjectFormProps {
  isLoading: boolean;
  onSubmit: (data: ProjectFormData) => void;
  onDelete?: () => void;
  isEdit?: boolean;
  initialData?: Project;
}

const schema = yup.object().shape({
  projectName: name.label('Name'),
  description: shortText.label('Description'),
});

const ProjectForm: FC<ProjectFormProps> = ({
  isLoading,
  onSubmit,
  onDelete,
  isEdit,
  initialData,
}) => {
  const { watch, handleSubmit, errors, register, control } = useForm({
    defaultValues: {
      projectName: initialData?.projectName,
      description: initialData?.description,
      membersEmails: [],
    },
    resolver: yupResolver(schema),
    shouldUnregister: false,
  });

  const navigate = useNavigate();

  const { projectName, description } = watch(['projectName', 'description']);

  return (
    <Card title={isEdit ? 'Edit a project' : 'Create a New Project'}>
      <Flex flexDirection="column">
        <Flex>
          <Input
            label="Name"
            readOnly={isEdit}
            name="projectName"
            disabled={isLoading}
            placeholder="project_acme"
            ref={register}
            labelAction={
              <Tooltip
                mainText="Only alphanumeric characters, dash or underscore"
                ml="5px"
              >
                <Icon icon="info-circle" />
              </Tooltip>
            }
            {...getInputValidation('projectName', errors)}
          />
          <Input
            labelProps={{ ml: '20px', flex: 1 }}
            label="Description"
            name="description"
            disabled={isLoading}
            placeholder="project about...."
            ref={register}
            {...getInputValidation('description', errors)}
          />
        </Flex>

        {!isEdit && <MembersForm control={control} isLoading={isLoading} />}

        {isEdit && onDelete && (
          <Label text="Danger zone" width="fit-content" mt={0}>
            <Button intent="alert" disabled={isLoading} onClick={onDelete}>
              Delete the project
            </Button>
          </Label>
        )}
        <Label mt="10px">
          Invite Collaborators
          <Box mt="5px">
            <Callout
              type={CalloutTypes.neutral}
              content={
                <Flex alignItems="center">
                  <Label>
                    In order to add a new user, follow the steps here
                  </Label>
                  <Button
                    pl="3px"
                    my="-8px"
                    onClick={() =>
                      window.open(
                        'https://hopsworks.readthedocs.io/en/latest/user_guide/hopsworks/projectMembers.html',
                        '_blank',
                      )
                    }
                    intent="inline"
                  >
                    here↗
                  </Button>
                </Flex>
              }
            />
          </Box>
        </Label>
        {!isEdit && (
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
              Create New Project
            </Button>
          </Flex>
        )}
        {isEdit && (
          <StickySummary
            title={cropText(projectName, 24)}
            firstValue={cropText(description, 50)}
            mainButton={
              <Button
                disabled={isLoading}
                intent="primary"
                onClick={handleSubmit(onSubmit)}
              >
                {isEdit ? 'Edit Project' : 'Create New Project'}
              </Button>
            }
            secondaryButton={
              <Button
                type="button"
                disabled={isLoading}
                intent="secondary"
                onClick={() => navigate(-1)}
              >
                Back
              </Button>
            }
          />
        )}
      </Flex>

      {isLoading && <Loader />}
    </Card>
  );
};

export default memo(ProjectForm);
