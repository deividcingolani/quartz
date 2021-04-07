import React, { FC } from 'react';
import { Box, Flex } from 'rebass';
import ProfileService from '../../../services/ProfileService';
import { ActivityItemData } from '../../../types/feature-group';
import { Badge, Labeling, User, Value } from '@logicalclocks/quartz';
import icons from '../../../sources/icons';

export interface JobExecutionProps {
  activity: ActivityItemData;
}

const JobExecution: FC<JobExecutionProps> = ({ activity }) => {
  const isSuccess = activity.job?.executions?.finalStatus === 'SUCCEEDED';

  return (
    <Flex
      bg="white"
      height="56px"
      alignItems="center"
      justifyContent="space-between"
    >
      <Flex alignItems="center" ml="20px">
        <Box>{icons.job}</Box>
        <Labeling width="110px" bold ml="8px" gray>
          Job execution
        </Labeling>
        <Box ml="20px" width="110px">
          <Badge
            width="fit-content"
            value={isSuccess ? 'success' : 'error'}
            variant={isSuccess ? 'success' : 'fail'}
          />
        </Box>
        <Value ml="20px">#{activity.job?.executions.id}</Value>
        <Value ml="20px">{activity.job?.name}</Value>
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

export default JobExecution;
