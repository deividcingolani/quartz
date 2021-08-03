// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, ReactNode } from 'react';
import { Flex } from 'rebass';
import { Badge, Labeling, User, Value } from '@logicalclocks/quartz';
import { headerStyles, rowStyles } from './accessRightTable.styles';
import ProfileService from '../../../../services/ProfileService';
import { PermissionTypes, SharedProject } from '../../../../types/multistore';
import {
  getDatasetType,
  permissionsToBadgeVariantMap,
  permissionsToLabelMap,
} from './utils';

export interface PermissionUsers {
  [PermissionTypes.READ_ONLY]: PermissionUser[];
  [PermissionTypes.EDITABLE_BY_OWNERS]: PermissionUser[];
  [PermissionTypes.EDITABLE]: PermissionUser[];
}

export interface PermissionUser {
  teamRole: string;
  email: string;
  firstname: string;
  lastname: string;
}

export enum AccessRightsTableTypes {
  FROM = 'FROM',
  WITH = 'WITH',
}

export interface AccessRightsTableProps {
  mainText: ReactNode;
  secondaryText?: ReactNode;
  shared?: SharedProject[];
  type?: AccessRightsTableTypes;
}

const AccessRightsTable: FC<AccessRightsTableProps> = ({
  mainText,
  type = AccessRightsTableTypes.WITH,
  secondaryText,
  shared,
}) => {
  const alphabetize = (a: SharedProject, b: SharedProject) => {
    return a.name.localeCompare(b.name);
  };

  return (
    <Flex flexDirection="column" width="100%">
      <Flex
        p="8px"
        sx={headerStyles}
        flexDirection="row"
        justifyContent="space-between"
      >
        {mainText}
        {secondaryText}
      </Flex>
      {type === AccessRightsTableTypes.WITH
        ? shared?.sort(alphabetize).map((project) => {
            const MAX_MEMBERS = 7;
            const isMaxMembers = project.projectTeam.length > MAX_MEMBERS;
            const members = isMaxMembers
              ? project.projectTeam?.slice(0, MAX_MEMBERS - 1)
              : project.projectTeam?.slice(0, MAX_MEMBERS);
            return (
              <Flex
                key={project.id}
                sx={rowStyles}
                flexDirection="column"
                p="8px"
              >
                <Flex flexDirection="row" justifyContent="space-between">
                  <Value>{project.name}</Value>
                  <Badge
                    width="fit-content"
                    value={
                      project.accepted
                        ? permissionsToLabelMap[project.permission]
                        : 'pending'
                    }
                    variant={
                      project.accepted
                        ? permissionsToBadgeVariantMap[project.permission]
                        : 'light'
                    }
                  />
                </Flex>
                <Flex flexDirection="row" mt="10px">
                  {members.map((team) => (
                    <Flex key={team.user.email} flexDirection="row">
                      <Flex mr="5px">
                        <User
                          title={team.teamRole}
                          name={`${team.user.fname} ${team.user.lname}`}
                          photo={ProfileService.avatar(team.user.email)}
                        />
                      </Flex>
                    </Flex>
                  ))}
                  {isMaxMembers && (
                    <Flex
                      height="33px"
                      width="33px"
                      justifyContent="center"
                      alignItems="center"
                      sx={{ bg: 'grayShade3', borderRadius: '30px' }}
                    >
                      <Labeling gray>{`+${
                        project.projectTeam.length - members.length
                      }`}</Labeling>
                    </Flex>
                  )}
                </Flex>
              </Flex>
            );
          })
        : shared?.sort(alphabetize).map((service) => (
            <Flex
              key={service.id}
              sx={rowStyles}
              flexDirection="column"
              p="8px"
            >
              <Flex flexDirection="row" justifyContent="space-between">
                <Value>{getDatasetType(service.name)}</Value>
                <Badge
                  width="fit-content"
                  value={permissionsToLabelMap[service.permission]}
                  variant={permissionsToBadgeVariantMap[service.permission]}
                />
              </Flex>
            </Flex>
          ))}
    </Flex>
  );
};

export default AccessRightsTable;
