import { Box, Flex } from 'rebass';
import { useParams } from 'react-router-dom';
import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import {
  Label,
  Button,
  Select,
  Callout,
  TinyPopup,
  RadioGroup,
  CalloutTypes,
  Tooltip,
  NotificationsManager,
} from '@logicalclocks/quartz';

import { User } from '../../../types/user';
import { useDispatch } from 'react-redux';
import { Dispatch } from '../../../store';
import NotificationTitle from '../../../utils/notifications/notificationBadge';
import NotificationContent from '../../../utils/notifications/notificationValue';

export interface AddMembersProps {
  members: User[];
  isOpen: boolean;
  onClose: () => void;
}

export enum Roles {
  'Data scientist' = 'Data scientist',
  'Data owner' = 'Data owner',
}

export interface ProjectMember {
  projectTeamPK: {
    projectId: number;
    teamMember: string;
  };
  teamRole: Roles;
}

const AddMembers: FC<AddMembersProps> = ({ members, isOpen, onClose }) => {
  const { id } = useParams();

  const [role, setRole] = useState(Roles['Data scientist']);
  const [selectedMembers, setMembers] = useState<ProjectMember[]>([]);

  const [selectedEmails, setEmails] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    const selected = selectedEmails.map((email) => ({
      projectTeamPK: {
        projectId: +id,
        teamMember: email,
      },
      teamRole: role,
    }));

    setMembers(selected);
  }, [selectedEmails, role, members, id]);

  const handleAddMembers = useCallback(async () => {
    setIsLoading(true);
    await dispatch.members.add({
      id: +id,
      data: {
        projectTeam: selectedMembers,
      },
    });

    const membersNames = selectedMembers
      .map(({ projectTeamPK }) => {
        const member = members.find(
          (d) => d.email === projectTeamPK.teamMember,
        );

        return member?.firstname;
      })
      .join(', ');

    NotificationsManager.create({
      isError: false,
      type: (
        <NotificationTitle
          message={`${selectedMembers.length} ${
            selectedMembers.length > 1 ? 'members' : 'members'
          } added`}
        />
      ),
      content: (
        <NotificationContent
          message={`${membersNames} has been added to the project`}
        />
      ),
    });

    await dispatch.project.refetchProject(+id);

    setEmails([]);

    setIsLoading(false);

    onClose();
  }, [selectedMembers, onClose, dispatch, id, members]);

  return (
    <TinyPopup
      width="440px"
      isOpen={isOpen}
      secondaryText=""
      onClose={onClose}
      title="Add members"
      secondaryButton={['Back', onClose]}
      mainButton={['Add members', handleAddMembers]}
      disabledMainButton={
        !members.length || !selectedMembers.length || isLoading
      }
    >
      <Tooltip
        mainText="All members of this cluster are part of this project"
        disabled={!!members.length}
      >
        <Select
          listWidth="100%"
          width="400px"
          isMulti={true}
          label="Members"
          hasPlaceholder={false}
          value={selectedEmails}
          placeholder="pick members"
          noDataMessage="no members defined"
          onChange={(value) => setEmails(value)}
          disabled={!members.length || isLoading}
          options={members.map(({ email }) => email)}
        />
      </Tooltip>

      <Box my="20px">
        <RadioGroup
          mr="20px"
          value={role}
          flexDirection="row"
          options={Object.keys(Roles)}
          disabled={!members.length || isLoading}
          onChange={(value) => setRole(value as Roles)}
        />
      </Box>

      <Box mb="20px">
        {!!members.length ? (
          <Callout
            type={CalloutTypes.neutral}
            content={
              <Flex alignItems="center">
                <Label>In order to add a new user, follow the steps here</Label>
                <Button
                  pl="3px"
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
        ) : (
          <Callout
            type={CalloutTypes.warning}
            content={
              <Flex flexDirection="column" alignItems="center">
                <Label sx={{ whiteSpace: 'break-spaces' }}>
                  All members of this cluster are part of this project. In order
                  to
                </Label>
                <Flex width="100%">
                  <Label>add a new user, follow the steps here</Label>
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
              </Flex>
            }
          />
        )}
      </Box>
    </TinyPopup>
  );
};

export default memo(AddMembers);
