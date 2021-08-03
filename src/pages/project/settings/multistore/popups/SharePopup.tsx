// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useEffect, useMemo } from 'react';
import { Box, Flex } from 'rebass';
import * as yup from 'yup';
import {
  TinyPopup,
  Select,
  Text,
  Callout,
  Value,
  CalloutTypes,
} from '@logicalclocks/quartz';
import { yupResolver } from '@hookform/resolvers/yup';
// Hooks
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
// Types
import {
  ShareableSevices,
  SharedProject,
} from '../../../../../types/multistore';
import { Project } from '../../../../../types/project';
import getInputValidation from '../../../../../utils/getInputValidation';
import { Dispatch, RootState } from '../../../../../store';
// Utils
import { permissionsToLabelMap, labelToPermissionsMap } from '../utils';

export interface SharePopupProps {
  project: Project;
  projects: Project[];
  shared: SharedProject[];
  handleToggle: () => void;
}

const schema = yup.object().shape({
  permission: yup.string().required().label('Access Rights'),
  selectedProject: yup.string().required().label('Project'),
});

const SharePopup: FC<SharePopupProps> = ({
  project,
  projects,
  shared,
  handleToggle,
}) => {
  const dispatch = useDispatch<Dispatch>();

  const isSharing = useSelector(
    (state: RootState) => state.loading.effects.multistore.shareWith,
  );

  const { errors, handleSubmit, reset, control } = useForm({
    defaultValues: {
      selectedProject: '',
      permission: permissionsToLabelMap.READ_ONLY,
      membersEmails: [],
    },
    shouldUnregister: false,
    resolver: yupResolver(schema),
  });

  const projectsToShare = useMemo(
    () =>
      projects
        .filter(
          (p) =>
            !shared.map((s) => s.id).includes(p.id) &&
            !(p.id === project.projectId),
        )
        .map((p) => p.name),
    [projects, shared, project.projectId],
  );

  const onShare = handleSubmit(async ({ permission, selectedProject }) => {
    const rightAccess = (labelToPermissionsMap as any)[permission];
    if (project.projectId && project.projectName) {
      await dispatch.multistore.shareWith({
        id: project.projectId,
        name: project.projectName,
        service: ShareableSevices.FEATURESTORE,
        targeProject: selectedProject,
        permissionType: rightAccess,
      });
      await dispatch.multistore.getSharedWith({
        id: project.projectId,
        name: project.projectName,
      });
      handleToggle();
    }
  });

  useEffect(() => {
    reset();
  }, [handleToggle, reset]);

  const canShare = useMemo(() => projectsToShare.length > 0, [projectsToShare]);
  return (
    <TinyPopup
      style={{ overflow: 'visible' }}
      title={`Share ${project.projectName} feature store`}
      secondaryText=""
      isOpen={true}
      mainButton={['Share', onShare]}
      disabledMainButton={!canShare || isSharing}
      disabledSecondaryButton={isSharing}
      secondaryButton={['back', handleToggle]}
      onClose={handleToggle}
    >
      <Box mb="20px">
        <Text lineHeight="14px" pb="20px" width="400px">
          Sharing the feature store with another project allows its users to
          access to its data and perform new actions like creating a training
          dataset with features from multiple feature stores.
        </Text>
        {!canShare && (
          <Flex pb="20px">
            <Callout
              content={
                <Value>
                  This project is already shared with all the other projects
                  available
                </Value>
              }
              type={CalloutTypes.neutral}
            />
          </Flex>
        )}
        <Controller
          control={control}
          name="selectedProject"
          render={({ onChange, value }: { value: string; onChange: any }) => (
            <Select
              pb="20px"
              width="100%"
              label="Project"
              placeholder="pick a project"
              listWidth="100%"
              disabled={!canShare}
              value={[value]}
              onChange={onChange}
              options={projectsToShare}
              {...getInputValidation('selectedProject', errors)}
            />
          )}
        />
        <Controller
          control={control}
          name="permission"
          render={({ onChange, value }: { value: string; onChange: any }) => (
            <Select
              width="100%"
              label="Access rights"
              placeholder=""
              listWidth="100%"
              value={[value]}
              onChange={onChange}
              // maxListHeight="65px"
              options={Object.values(permissionsToLabelMap)}
              {...getInputValidation('permission', errors)}
            />
          )}
        />
      </Box>
    </TinyPopup>
  );
};

export default SharePopup;
