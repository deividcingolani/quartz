import {
  Row,
  Card,
  User,
  Badge,
  Value,
  Select,
  Button,
  Tooltip,
  usePopup,
  Labeling,
  TinyPopup,
  IconButton,
  TooltipPositions,
  NotificationsManager,
} from '@logicalclocks/quartz';
import { Box, Flex } from 'rebass';
import { useParams } from 'react-router-dom';
import React, {
  ComponentType,
  FC,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Types
import { Project } from '../../../types/project';
import { Dispatch, RootState } from '../../../store';
import { User as UserType } from '../../../types/user';
// Services
import ProfileService from '../../../services/ProfileService';
// Styles
import styles from '../sources/list/source-list.styles';
// Selectors
import {
  selectIsDeletingMember,
  selectIsEditingMember,
  selectIsRefetchingProject,
  selectMembers,
} from '../../../store/models/projects/selectors';
// Components
import AddMembers from '../forms/AddMembers';
// Utils
import { uppercaseFirst } from '../../../utils/uppercaseFirst';
import NotificationTitle from '../../../utils/notifications/notificationBadge';
import NotificationContent from '../../../utils/notifications/notificationValue';

export interface SourceListContentProps {
  data: Project;
}

const contentProps = {
  pb: 0,
};

const getVariant = (role: string) => {
  const rolesMap = new Map<string, string>([
    ['Author', 'success'],
    ['Data owner', 'bold'],
    ['Data scientist', 'light'],
  ]);

  return rolesMap.get(role);
};

const DATA_OWNER = 'Data owner';

const ProjectMembers: FC<SourceListContentProps> = ({ data }) => {
  const { id } = useParams();

  const allMembers = useSelector(selectMembers);

  const isDeletingMembers = useSelector(selectIsDeletingMember);
  const isEditingMembers = useSelector(selectIsEditingMember);
  const isRefetchingList = useSelector(selectIsRefetchingProject);

  const [removedUser, setRemovedUser] = useState<
    UserType & { index: number }
  >();

  const [isOpen, handleToggle] = usePopup();

  const dispatch = useDispatch<Dispatch>();

  const membersToSelect = useMemo(() => {
    return allMembers.filter(
      ({ email }) => !data.projectTeam.find(({ user }) => user.email === email),
    );
  }, [data, allMembers]);

  const [isEditMembers, setIsEdit] = useState<boolean>(false);
  const [isAddMembers, setIsAddMembers] = useState<boolean>(false);

  const me = useSelector((state: RootState) => state.profile);

  const myRole = useMemo(() => {
    return data.projectTeam.find((user) => user.user.fname === me.firstname)
      ?.teamRole;
  }, [data, me]);

  const projectTeam = useMemo(() => {
    return data.projectTeam.sort(
      ({ user: userA }, { user: userB }) =>
        userA.fname?.localeCompare(userB.fname || '') || 1,
    );
  }, [data]);

  const handleChangeRole = useCallback(
    (index: number) => async (value: string[]) => {
      const userEmail = projectTeam[index].user.email;

      if (userEmail) {
        await dispatch.members.edit({
          id: +id,
          email: userEmail,
          role: uppercaseFirst(value[0]),
        });

        NotificationsManager.create({
          isError: false,
          type: <NotificationTitle message="Member updated" />,
          content: (
            <NotificationContent
              message={`${projectTeam[index].user.fname} became ${value[0]}`}
            />
          ),
        });

        dispatch.project.refetchProject(+id);
      }
    },
    [dispatch, projectTeam, id],
  );

  const handleDelete = useCallback(
    (index: number) => () => {
      const userToDelete = projectTeam[index]?.user;

      if (userToDelete) {
        setRemovedUser({
          ...userToDelete,
          index,
        });

        handleToggle();
      }
    },
    [projectTeam, handleToggle],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (removedUser) {
      await dispatch.members.delete({
        id: +id,
        email: removedUser.email,
      });

      NotificationsManager.create({
        isError: false,
        type: <NotificationTitle message="Member removed" />,
        content: (
          <NotificationContent
            message={`${removedUser.fname} has been removed from the project`}
          />
        ),
      });

      dispatch.project.refetchProject(+id);

      handleToggle();
    }
  }, [dispatch, handleToggle, id, removedUser]);

  const groupComponents = useMemo(() => {
    if (isEditMembers) {
      return projectTeam.map(({ user }) => [
        Tooltip,
        Value,
        Labeling,
        Select,
        user.email !== me.email && user.email !== data.owner
          ? IconButton
          : () => null,
      ]);
    }
    return projectTeam.map(() => [Tooltip, Value, Labeling, Badge]);
  }, [projectTeam, isEditMembers, me, data]);

  const groupProps = useMemo(() => {
    if (isEditMembers) {
      return projectTeam.map(({ user, teamRole }, index) => [
        {
          mainText: user.email,
          ml: '10px',
          position: TooltipPositions.right,
          children: (
            <User name={user.email} photo={ProfileService.avatar(user.email)} />
          ),
        },
        {
          variant: 'bold',
          ml: '20px',
          children: user.fname,
        },
        {
          children: user.email,
          ml: '20px',
          gray: true,
        },
        {
          value: [
            user.email === data.owner ? 'author' : teamRole.toLowerCase(),
          ],
          disabled:
            user.email === data.owner ||
            user.email === me.email ||
            isEditingMembers ||
            isRefetchingList,
          options: ['data owner', 'data scientist'],
          width: 'fit-content',
          onChange: (value: string[]) => handleChangeRole(index)(value),
        },
        user.email !== me.email && user.email !== data.owner
          ? {
              tooltip: 'remove',
              intent: 'ghost',
              icon: ['far', 'trash-alt'],
              onClick: handleDelete(index),
            }
          : {},
      ]);
    }
    return projectTeam.map(({ user, teamRole }) => [
      {
        children: (
          <User name={user.email} photo={ProfileService.avatar(user.email)} />
        ),
      },
      {
        variant: 'bold',
        ml: '20px',
        children: user.fname,
      },
      {
        children: user.email,
        ml: '20px',
        gray: true,
      },
      {
        width: 'max-content',
        value: user.email === data.owner ? 'author' : teamRole.toLowerCase(),
        variant: getVariant(user.email === data.owner ? 'Author' : teamRole),
        fontFamily: 'Inter',
        mr: '10px',
      },
    ]);
  }, [
    me,
    data,
    projectTeam,
    handleDelete,
    isEditMembers,
    handleChangeRole,
    isEditingMembers,
    isRefetchingList,
  ]);

  return (
    <>
      <TinyPopup
        width="440px"
        isOpen={isOpen}
        onClose={handleToggle}
        disabledMainButton={isDeletingMembers}
        secondaryButton={['Back', handleToggle]}
        mainButton={['Remove user', handleConfirmDelete]}
        title={`Remove ${removedUser?.fname} from this project`}
        secondaryText={`${removedUser?.fname} won't have access to this project anymore. You can still han ${removedUser?.fname} to this project later`}
      />
      <AddMembers
        isOpen={isAddMembers}
        members={membersToSelect}
        onClose={() => setIsAddMembers(false)}
      />
      <Card
        mt="30px"
        title="Members"
        actions={
          myRole === DATA_OWNER && (
            <Button
              mr="-10px"
              intent="inline"
              onClick={() => setIsEdit(!isEditMembers)}
            >
              {isEditMembers ? 'done' : 'manage members'}
            </Button>
          )
        }
        contentProps={contentProps}
      >
        <Flex alignItems="center" pb="15px" justifyContent="space-between">
          <Flex>
            <Value primary>{data.projectTeam.length}</Value>
            <Labeling bold ml="5px">
              {data.projectTeam.length > 1 ? 'members' : 'member'}
            </Labeling>
          </Flex>
          {myRole === DATA_OWNER && (
            <Button onClick={() => setIsAddMembers(true)}>Add members</Button>
          )}
        </Flex>
        <Box sx={styles} mx="-20px">
          <Row
            middleColumn={2}
            groupProps={groupProps}
            legend={['', 'name', 'email', 'role']}
            groupComponents={groupComponents as ComponentType<any>[][]}
          />
        </Box>
      </Card>
    </>
  );
};

export default ProjectMembers;
