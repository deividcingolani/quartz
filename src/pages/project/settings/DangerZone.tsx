// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback, useState } from 'react';
import {
  Card,
  Value,
  Button,
  Callout,
  CalloutTypes,
  TinyPopup,
  usePopup,
  Input,
} from '@logicalclocks/quartz';
import { Box, Flex } from 'rebass';
import { useDispatch, useSelector } from 'react-redux';
// Hooks
import useNavigateRelative from '../../../hooks/useNavigateRelative';
// Types
import { Project } from '../../../types/project';
import { Dispatch, RootState } from '../../../store';

export interface DangerZoneProps {
  data: Project;
}

const DangerZone: FC<DangerZoneProps> = ({ data }) => {
  const [isOpen, handleToggle] = usePopup();
  const [projectConfirm, setProjectConfirm] = useState('');
  const [inputError, setInputError] = useState('');

  const isDeleting = useSelector(
    (state: RootState) => state.loading.effects.project.delete,
  );

  const dispatch = useDispatch<Dispatch>();

  const navigate = useNavigateRelative();

  const handleDelete = useCallback(async () => {
    if (projectConfirm !== data.projectName) {
      setInputError('Confirmation does not match current project name');
    } else {
      setInputError('');
      await dispatch.project.delete({ id: data.projectId as number });
      navigate(`/`);
    }
  }, [
    data.projectId,
    data.projectName,
    dispatch.project,
    navigate,
    projectConfirm,
  ]);

  return (
    <>
      <TinyPopup
        width="440px"
        isOpen={isOpen}
        onClose={handleToggle}
        disabledMainButton={projectConfirm === '' || isDeleting}
        disabledSecondaryButton={isDeleting}
        closeOnBackdropClick={!isDeleting}
        secondaryButton={['Back', handleToggle]}
        mainButton={['Delete project permanently', handleDelete]}
        title={`Delete ${data.projectName}`}
        secondaryText="Once you delete a project, there is no going back. Please be certain. To confirm, enter the name of the project."
      >
        <Input
          label="Confirmation: project name"
          width="100%"
          intent={inputError === '' ? 'default' : 'error'}
          info={inputError}
          value={projectConfirm}
          placeholder="Enter project name to delete it"
          onChange={({ target }: any) => setProjectConfirm(target.value)}
        />
        <Box mb="20px" />
      </TinyPopup>
      <Card mt="20px" title="Danger zone">
        <Box>
          <Callout
            content={
              <Flex alignItems="center">
                <Value>
                  Deleting a project is irreversible. All data attached will be
                  permanently deleted.
                </Value>
              </Flex>
            }
            type={CalloutTypes.neutral}
          />

          <Flex mt="20px">
            <Button
              onClick={handleToggle}
              intent="alert"
              disabled={!data?.projectId}
            >
              Delete project
            </Button>
          </Flex>
        </Box>
      </Card>
    </>
  );
};

export default DangerZone;
