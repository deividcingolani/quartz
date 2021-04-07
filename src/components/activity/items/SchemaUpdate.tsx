import React, { FC } from 'react';
import { Box, Flex } from 'rebass';
import { ActivityItemData } from '../../../types/feature-group';
import ProfileService from '../../../services/ProfileService';
import { Labeling, User, Value } from '@logicalclocks/quartz';
import icons from '../../../sources/icons';

export interface SchemaUpdateProps {
  activity: ActivityItemData;
}

const SchemaUpdate: FC<SchemaUpdateProps> = ({ activity }) => {
  return (
    <Flex
      bg="white"
      height="56px"
      alignItems="center"
      justifyContent="space-between"
    >
      <Flex ml="20px">
        <Box>{icons.schema_update}</Box>
        <Labeling width="110px" bold ml="8px" gray>
          Schema update
        </Labeling>
        <Value ml="20px">2 new columns</Value>
        <Value ml="5px">column_123,</Value>
        <Value ml="5px">column_13</Value>
      </Flex>

      <Box mr="20px">
        <User
          photo={ProfileService.avatar(String(activity.user.email))}
          name={activity.user.firstname}
        />
      </Box>
    </Flex>
  );
};

export default SchemaUpdate;
