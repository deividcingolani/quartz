// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo, useMemo } from 'react';
import { Box, Flex } from 'rebass';
import {
  Button,
  Card,
  FreshnessBar,
  Input,
  Labeling,
  Microlabeling,
  TinyPopup,
  usePopup,
  Value,
} from '@logicalclocks/quartz';
import * as yup from 'yup';
// Hooks
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
// Utils
import { formatDistance } from 'date-fns';
import getInputValidation from '../../../utils/getInputValidation';
// Types
import { User } from '../../../types/user';
import { Project } from '../../../types/project';
import { RootState } from '../../../store';
// Components
import DateValue from '../feature-group/list/DateValue';
import ProjectMembers from './ProjectMembers';
import useGetHrefForRoute from '../../../hooks/useGetHrefForRoute';
import Shortcuts from './Shortcuts';
import { shortText } from '../../../utils/validators';

export interface ContentProps {
  data: Project;
  currentUser: User;
  onUpdateDescription: (data: { description: string }) => void;
  onClickEdit: () => void;
}

const OverviewContent: FC<ContentProps> = ({
  data,
  currentUser,
  onClickEdit,
  onUpdateDescription,
}) => {
  const [isOpen, handleToggle] = usePopup();

  const getHref = useGetHrefForRoute();

  const userRole = useMemo(() => {
    const userInTeam = data.projectTeam?.find(
      ({ user }) => user.username === currentUser.username,
    );
    return userInTeam?.teamRole;
  }, [currentUser.username, data.projectTeam]);

  const schema = yup.object().shape({
    description: shortText.label('Description'),
  });

  const { errors, register, handleSubmit } = useForm({
    defaultValues: { description: data?.description },
    resolver: yupResolver(schema),
    shouldUnregister: false,
  });

  const isSubmitting = useSelector(
    (state: RootState) => state.loading.effects.project.edit,
  );

  return (
    <>
      <TinyPopup
        width="440px"
        isOpen={isOpen}
        onClose={handleToggle}
        disabledMainButton={isSubmitting}
        disabledSecondaryButton={isSubmitting}
        closeOnBackdropClick={!isSubmitting}
        secondaryButton={['Back', handleToggle]}
        mainButton={['Save', handleSubmit(onUpdateDescription)]}
        title="Edit description"
        secondaryText=""
      >
        <Input
          label="Description"
          name="description"
          width="100%"
          ref={register}
          placeholder="Enter description to edit it"
          {...getInputValidation('description', errors)}
        />
        <Box mb="20px" />
      </TinyPopup>
      <Card
        actions={
          <Button
            href={getHref(`/p/${data.projectId}/settings`)}
            mr="-10px"
            intent="inline"
            onClick={onClickEdit}
          >
            Project Settings
          </Button>
        }
        title="Project overview"
      >
        <Box>
          <Flex
            alignItems="center"
            p="10px"
            sx={{ border: '1px solid', borderColor: 'grayShade2' }}
          >
            <Value>Your role for this project is</Value>
            &nbsp;
            <Value color="labels.green">{userRole}</Value>
          </Flex>
        </Box>
        <Flex flexDirection="column">
          <Flex flexDirection="row" alignItems="baseline">
            <Labeling mt="20px" gray>
              {data.description}
            </Labeling>

            <Button
              ml="5px"
              variant="inline"
              p="0"
              mt="15px"
              onClick={handleToggle}
            >
              {data.description ? 'edit description' : '+ add a description'}
            </Button>
          </Flex>
          <Flex mt="25px" alignItems="center">
            {!!data.created && (
              <>
                <Flex width="max-content" flexDirection="column" mr="30px">
                  <Microlabeling gray mb="3px" width="100%">
                    Last updated
                  </Microlabeling>
                  <Flex alignItems="center">
                    <FreshnessBar time={data.created.replace('T', ' ')} />
                    <Value fontFamily="Inter" ml="5px" primary>
                      {formatDistance(new Date(data.created), new Date())} ago
                    </Value>
                  </Flex>
                </Flex>
                <DateValue
                  mr="20px"
                  label="Created on"
                  date={new Date(data.created)}
                />
              </>
            )}
            <Flex flexDirection="column" ml="30px">
              <Microlabeling mb="3px" gray>
                Feature Groups
              </Microlabeling>
              <Value primary>{data.featureGroupsCount}</Value>
            </Flex>
            <Flex flexDirection="column" ml="30px">
              <Microlabeling mb="3px" gray>
                Training Datasets
              </Microlabeling>
              <Value primary>{data.trainingDatasetsCount}</Value>
            </Flex>
          </Flex>
          {!!data.projectTeam && <ProjectMembers data={data} />}
        </Flex>
      </Card>
      <Shortcuts userId={currentUser.id} />
    </>
  );
};

export default memo(OverviewContent);
