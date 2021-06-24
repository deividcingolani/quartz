// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Box } from 'rebass';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Badge,
  Button,
  Labeling,
  NotificationsManager,
  Select,
  Value,
} from '@logicalclocks/quartz';

import { Dispatch, RootState } from '../../../store';
import { ClusterRowProps, ClusterStates } from '../../../types/databricks';
// Components
import NotificationTitle from '../../../utils/notifications/notificationBadge';
import NotificationContent from '../../../utils/notifications/notificationValue';
import { Roles } from '../forms/AddMembers';

const getIntent = (status: string): 'light' | 'bold' | 'success' => {
  const statusMap = new Map<string, 'light' | 'bold' | 'success'>([
    [ClusterStates.PENDING, 'bold'],
    [ClusterStates.RUNNING, 'success'],
    [ClusterStates.TERMINATED, 'light'],
  ]);

  return statusMap.get(status) || 'bold';
};

const ClusterRow: FC<ClusterRowProps> = ({
  databricks: { url },
  cluster: { id, name, state, user, project },
  members,
}) => {
  const { id: projectId } = useParams();

  const dispatch = useDispatch<Dispatch>();

  const currentProject = useSelector((state: RootState) => state.project);

  const [isLoading, setLoading] = useState<boolean>(false);

  const [configuredIsLoggedUser, setIsLogin] = useState<boolean>(false);

  const [options, setOptions] = useState<string[]>([]);

  const [selectedMember, setMember] = useState<string[]>([]);

  const me = useSelector((state: RootState) => state.profile);

  const role = useMemo(() => {
    const userInTeam = members.find(
      ({ user }) => user.username === me.username,
    );

    return userInTeam?.teamRole;
  }, [me, members]);

  useEffect(() => {
    let dataMembers = members.map(({ user: member }) =>
      member.fname === user?.firstname
        ? `${member.fname} (currently configured)`
        : member.fname,
    );

    if (user?.firstname) {
      if (user.firstname === me.firstname) {
        setIsLogin(true);
      }

      setMember([`${user.firstname} (currently configured)`]);
    } else if (members.length > 0) {
      setMember([members[0].user.fname]);
    }

    if (role !== Roles['Data owner']) {
      dataMembers = dataMembers.filter((member) => {
        const name = member.includes('currently')
          ? member.slice(0, member.indexOf(' ('))
          : member;

        return name === me.firstname;
      });
    }

    setOptions(dataMembers);
  }, [members, user, role, me]);

  const handleChange = useCallback((value: string[]) => {
    setMember(value);
  }, []);

  const handleConfigure = useCallback(async () => {
    const userName = selectedMember[0].includes(' (')
      ? selectedMember[0].slice(0, selectedMember[0].indexOf(' ('))
      : selectedMember[0];

    const member = members.find(({ user }) => user.fname === userName);

    if (member) {
      setLoading(true);

      NotificationsManager.create({
        isError: false,
        type: <NotificationTitle message="Configuration started" />,
        content: (
          <NotificationContent message={`Configuration started for ${name}`} />
        ),
      });

      await dispatch.databricks
        .configureCluster({
          data: {
            clusterId: id,
            projectId: +projectId,
            instanceName: url,
            userName: member.user.username,
          },
        })
        .then(() => {
          NotificationsManager.create({
            isError: false,
            type: <NotificationTitle message="Configuration done" />,
            content: (
              <NotificationContent message={`Configuration done for ${name}`} />
            ),
          });

          dispatch.databricks.updateUserAndStatus({
            data: {
              clusterId: id,
              instanceName: url,
              userName,
            },
          });
        })
        .catch(() => {
          NotificationsManager.create({
            type: <NotificationTitle message="Fail" />,
            content: (
              <NotificationContent
                message={`Configuration failed for ${name}`}
              />
            ),
          });
        });

      setLoading(false);
    }
  }, [dispatch, projectId, id, url, members, name, selectedMember]);

  return (
    <Box
      as="tr"
      width="100%"
      sx={{
        boxShadow: '0px -1px 0px rgba(0, 0, 0, 0.25)',
      }}
    >
      <td
        width="auto"
        style={{
          textAlign: 'left',
          whiteSpace: 'nowrap',
          padding: '16px 20px',
        }}
      >
        <Value>{id}</Value>
      </td>
      <td
        width="auto"
        style={{
          textAlign: 'left',
          paddingRight: '20px',
        }}
      >
        <Value>{name}</Value>
      </td>
      <td
        width="auto"
        style={{
          textAlign: 'left',
          paddingRight: '20px',
        }}
      >
        <Box width="fit-content">
          <Badge value={state.toLowerCase()} variant={getIntent(state)} />
        </Box>
      </td>
      <td
        width="100%"
        style={{
          textAlign: 'left',
          paddingRight: '20px',
        }}
      >
        <Labeling gray={true} bold={true}>
          {project}
        </Labeling>
      </td>
      <td
        width="auto"
        style={{
          textAlign: 'left',
          paddingRight: '20px',
        }}
      >
        <Select
          width="auto"
          options={options}
          placeholder="name"
          value={selectedMember}
          onChange={handleChange}
          listWidth="100%"
          disabled={role !== Roles['Data owner'] && configuredIsLoggedUser}
        />
      </td>
      <td
        width="auto"
        style={{
          textAlign: 'left',
          paddingRight: '20px',
        }}
      >
        <Button
          intent="ghost"
          onClick={handleConfigure}
          disabled={
            isLoading ||
            state === ClusterStates.PENDING ||
            (selectedMember[0]?.includes('currently') &&
              project === currentProject.projectName)
          }
        >
          Configure
        </Button>
      </td>
    </Box>
  );
};

export default ClusterRow;
