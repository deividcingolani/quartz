import {
  Row,
  Card,
  Badge,
  Labeling,
  Tooltip,
  Value,
  Button,
  TooltipPositions,
  User,
} from '@logicalclocks/quartz';
import { Box, Flex } from 'rebass';
import React, { ComponentType, FC, useMemo } from 'react';

// Types
import { Project } from '../../../types/project';

import ProfileService from '../../../services/ProfileService';
// Styles
import styles from '../sources/list/source-list.styles';

export interface SourceListContentProps {
  data: Project;
}

const contentProps = {
  pb: 0,
};

const DATA_OWNER = 'Data owner';

const ProjectMembers: FC<SourceListContentProps> = ({ data }) => {
  const groupComponents = useMemo(() => {
    return data.projectTeam.map(({ teamRole }) => [
      Tooltip,
      Value,
      Labeling,
      ...(teamRole === DATA_OWNER ? [Badge] : [() => null]),
    ]);
  }, [data]);

  const groupProps = useMemo(() => {
    return data.projectTeam.map(({ user, teamRole }) => [
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
      teamRole === DATA_OWNER
        ? {
            value: 'author',
            variant: 'success',
            fontFamily: 'Inter',
            mr: '10px',
          }
        : {},
    ]);
  }, [data]);

  return (
    <Card
      mt="30px"
      title="Members"
      actions={
        <Button
          onClick={() =>
            window.open(
              'https://hopsworks.readthedocs.io/en/latest/admin_guide/user-administration.html',
              '_blank',
            )
          }
          mr="-10px"
          intent="inline"
        >
          add members
        </Button>
      }
      contentProps={contentProps}
    >
      <Flex alignItems="center" pb="15px">
        <Value primary>{data.projectTeam.length}</Value>
        <Labeling bold ml="5px">
          {data.projectTeam.length > 1 ? 'members' : 'member'}
        </Labeling>
      </Flex>
      <Box sx={styles} mx="-20px">
        <Row
          middleColumn={2}
          groupComponents={groupComponents as ComponentType<any>[][]}
          groupProps={groupProps}
        />
      </Box>
    </Card>
  );
};

export default ProjectMembers;
