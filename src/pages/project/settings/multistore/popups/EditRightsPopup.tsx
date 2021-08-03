// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback, useEffect } from 'react';
import * as yup from 'yup';
import { Box, Flex } from 'rebass';
import { TinyPopup, Select, Labeling } from '@logicalclocks/quartz';
// Hooks
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
// Types
import {
  PermissionTypes,
  ShareableSevices,
  SharedProject,
} from '../../../../../types/multistore';
import { Project } from '../../../../../types/project';
import { Dispatch, RootState } from '../../../../../store';
// Utils
import { permissionsToLabelMap, labelToPermissionsMap } from '../utils';

export interface EditRightsProps {
  shared: SharedProject[];
  project: Project;
  handleToggle: () => void;
}

const schema = yup.object();

interface PermissionField {
  projectId: number;
  projectName: string;
  permission: PermissionTypes;
  newPermission?: any;
}

const EditRights: FC<EditRightsProps> = ({ shared, project, handleToggle }) => {
  const dispatch = useDispatch<Dispatch>();
  const isUpdatingPermission = useSelector(
    (state: RootState) => state.loading.effects.multistore.changePermission,
  );

  const { handleSubmit, reset, control } = useForm({
    defaultValues: {},
    shouldUnregister: false,
    resolver: yupResolver(schema),
  });

  const { append } = useFieldArray({ control, name: 'fields' });

  const getFieldsChanged = (fields: PermissionField[]) => {
    const changed = fields
      .map((field: PermissionField) => ({
        ...field,
        newPermission: labelToPermissionsMap[field.newPermission] || 'unshare',
      }))
      .filter((field) => field.permission !== field.newPermission);

    const sorted = changed.reduce((acc, field) => {
      if (Object.keys(PermissionTypes).includes(field.newPermission)) {
        acc.permission = [...(acc?.permission || []), field];
      } else {
        acc.deletion = [...(acc?.deletion || []), field];
      }
      return acc;
    }, {} as { permission: PermissionField[]; deletion: PermissionField[] });
    return sorted;
  };

  const onSubmit = handleSubmit(
    async ({ fields }: { fields: PermissionField[] }) => {
      const changed = getFieldsChanged(fields);
      if (changed?.permission) {
        await Promise.allSettled(
          changed.permission.map(async (item: PermissionField) => {
            if (project.projectId && project.projectName) {
              await dispatch.multistore.changePermissions({
                id: project.projectId,
                name: project.projectName,
                targeProject: item.projectName,
                permissionType: item.newPermission,
              });
            }
          }),
        );
      }
      if (changed?.deletion) {
        await Promise.allSettled(
          changed.deletion.map(async (item: PermissionField) => {
            if (project.projectId && project.projectName) {
              await dispatch.multistore.unshareWith({
                id: project.projectId,
                name: project.projectName,
                service: ShareableSevices.FEATURESTORE,
                targeProject: item.projectName,
              });
            }
          }),
        );
      }
      if (
        (changed?.deletion || changed?.permission) &&
        project.projectId &&
        project.projectName
      ) {
        await dispatch.multistore.getSharedWith({
          id: project.projectId,
          name: project.projectName,
        });
      }

      handleToggle();
    },
  );

  useEffect(() => {
    reset();
  }, [handleToggle, reset]);

  useEffect(() => {
    shared.forEach(({ id, permission, name }) => {
      const field = {
        projectId: id,
        projectName: name,
        permission,
      } as PermissionField;
      append(field);
    });
  }, [append, shared]);

  return (
    <TinyPopup
      style={{ overflow: 'visible' }}
      title="Edit feature store sharing rights"
      secondaryText=""
      isOpen={true}
      mainButton={['Save', onSubmit]}
      secondaryButton={['back', handleToggle]}
      disabledMainButton={isUpdatingPermission}
      disabledSecondaryButton={isUpdatingPermission}
      onClose={handleToggle}
    >
      <Box mb="20px">
        {shared.map((project, idx) => (
          <Box key={project.id} mb="20px">
            <Flex justifyContent="space-between" alignItems="center">
              <Labeling sx={{ color: 'labels.green' }} bold>
                {project.name}
              </Labeling>
              <Controller
                control={control}
                name={`fields[${idx}].newPermission`}
                defaultValue={permissionsToLabelMap[project.permission]}
                render={({ onChange, value }) => (
                  <Select
                    width="210px"
                    placeholder=""
                    listWidth="210px"
                    value={[value]}
                    onChange={onChange}
                    options={[
                      ...Object.values(permissionsToLabelMap),
                      'unshare',
                    ]}
                  />
                )}
              />
            </Flex>
          </Box>
        ))}
      </Box>
    </TinyPopup>
  );
};

export default EditRights;
