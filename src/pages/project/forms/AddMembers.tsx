import { Box, Flex } from 'rebass';
import { useParams } from 'react-router-dom';
import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import {
  Label,
  Button,
  Callout,
  TinyPopup,
  CalloutTypes,
  Tooltip,
  NotificationsManager,
  EditableSelect,
  Select,
  Labeling,
  Divider,
} from '@logicalclocks/quartz';

import { User } from '../../../types/user';
import { useDispatch } from 'react-redux';
import { Dispatch } from '../../../store';
import NotificationTitle from '../../../utils/notifications/notificationBadge';
import NotificationContent from '../../../utils/notifications/notificationValue';

export interface AddMembersProps {
  members: User[];
  isOpen: boolean;
  isSearchEnabled: boolean;
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

const AddMembers: FC<AddMembersProps> = ({ members, isOpen, isSearchEnabled, onClose }) => {
  const { id } = useParams();

  const [selectedMembers, setMembers] = useState<ProjectMember[]>([]);

  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [roles, setRoles] = useState<Roles[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    const selected = selectedEmails.map((email, idx) => ({
      projectTeamPK: {
        projectId: +id,
        teamMember: email,
      },
      teamRole: roles[idx],
    }));

    setMembers(selected);
  }, [selectedEmails, roles, members, id]);

  const handleEmailsSelection = (value: string[]) => {
    const deletedIdx = selectedEmails
      .filter((x) => !value.includes(x))
      .map((x) => selectedEmails.indexOf(x));

    const newV = value.filter((x) => !selectedEmails.includes(x));
    setSelectedEmails(value);
    setRoles((roles) => [
      ...roles.filter((_x, idx) => !deletedIdx.includes(idx)),
      ...newV.map(() => Roles['Data owner']),
    ]);
  };

  const handleRolesChange = (value: string[], idx: number) => {
    setRoles(
      (prev) =>
        [...prev.slice(0, idx), ...value, ...prev.slice(idx + 1)] as Roles[],
    );
  };

  const handleAddMembers = useCallback(async () => {
    setIsLoading(true);
    try{
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

          return members.length? member?.firstname : projectTeamPK.teamMember;
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
    } catch(error) {
      //nothing to do. Added so that it can continue with the rest of the code  
    }
    await dispatch.project.refetchProject(+id);

    setSelectedEmails([]);

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
        (!members.length && isSearchEnabled) || !selectedMembers.length || isLoading
      }
    >
      {isSearchEnabled? 
        (
          <Tooltip
            mainText="All members of this cluster are part of this project"
            disabled={!!members.length}
          >
            <EditableSelect
              width="400px"
              isMulti
              label="Members"
              type="searchable"
              value={selectedEmails}
              placeholder="pick members"
              noDataMessage="no members defined"
              onChange={handleEmailsSelection}
              disabled={!members.length || isLoading}
              options={members.map(({ email }) => email)}
            />
          </Tooltip>
        ):
        (
          <Tooltip
            mainText="Enter the email of a user you want to add"
          >
            <EditableSelect
              width="400px"
              isMulti
              label="Members"
              type="editable"
              value={selectedEmails}
              placeholder="enter an email"
              noDataMessage=""
              options={[]}
              onChange={handleEmailsSelection}
            />
          </Tooltip>
        )
      }
      {selectedEmails.length > 0 && (
        <>
          <Divider px="20px" />
          {selectedEmails.map((email, idx) => {
            const member = members.find((x) => x.email === email);
            return (
              <Flex
                key={email}
                flexDirection="row"
                mb="20px"
                justifyContent="space-between"
              >
                <Flex flexDirection="column">
                  {isSearchEnabled && <Label mb="5px">{`${member?.firstname} ${member?.lastname}`}</Label>}
                  <Labeling
                    sx={{
                      wordBreak: 'break-all',
                      marginRight: '10px',
                    }}
                  >
                    {email}
                  </Labeling>
                </Flex>
                <Select
                  mb="5px"
                  value={[roles[idx]]}
                  placeholder=""
                  listWidth="100%"
                  onChange={(val) => handleRolesChange(val, idx)}
                  options={Object.keys(Roles)}
                />
              </Flex>
            );
          })}
        </>
      )}
      <Box my="20px">
        {!!members.length || !isSearchEnabled? (
          <Callout
            type={CalloutTypes.neutral}
            content={
              <Flex alignItems="center">
                <Label>In order to add a new user, follow the steps</Label>
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
