// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC } from 'react';
import { Box, Flex } from 'rebass';
import { Labeling, Value, User } from '@logicalclocks/quartz';
import { ActivityItemData } from '../../../types/feature-group';
import ProfileService from '../../../services/ProfileService';
import icons from '../../../sources/icons';

export interface CreationProps {
  activity: ActivityItemData;
}

const Creation: FC<CreationProps> = ({ activity }) => {
  return (
    <Flex
      justifyContent="space-between"
      height="56px"
      bg="grayShade3"
      alignItems="center"
    >
      <Flex alignItems="center" ml="20px">
        <Box>{icons.creation}</Box>
        <Labeling width="120px" bold ml="8px" gray>
          Creation
        </Labeling>
        <Value ml="140px">{activity.metadata}</Value>
      </Flex>

      <Box mr="76px">
        <User
          photo={ProfileService.avatar(String(activity.user.email))}
          name={activity.user.firstname}
        />
      </Box>
    </Flex>
  );
};

export default Creation;
