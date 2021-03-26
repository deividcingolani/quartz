import React, { FC } from 'react';
import { Box, Flex } from 'rebass';
import ProfileService from '../../../services/ProfileService';
import { ActivityItemData } from '../../../types/feature-group';
import { Badge, Labeling, User, Value } from '@logicalclocks/quartz';

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
      <Flex alignItems="center">
        <Box ml="20px">
          <svg
            width="16"
            height="17"
            viewBox="0 0 16 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.8697 6.56058L15.2411 5.85339C15.0675 5.65808 14.7861 5.65808 14.6125 5.85339L14.2983 6.20683L13.4955 5.30371C13.6519 4.63778 13.5055 3.9006 13.0414 3.37841L11.7844 1.96436C10.0489 0.011879 7.23467 0.011879 5.49883 1.96436L8.01301 3.37841V3.96435C8.01301 4.49466 8.20023 5.0034 8.53384 5.3784L9.89885 6.91401C10.363 7.43619 11.0183 7.60088 11.6103 7.42494L12.413 8.32806L12.0989 8.6815C11.9253 8.87681 11.9253 9.19337 12.0989 9.38868L12.7275 10.0959C12.9011 10.2912 13.1825 10.2912 13.3561 10.0959L15.8703 7.26745C16.0433 7.07245 16.0433 6.75589 15.8697 6.56058ZM7.90523 6.08558C7.80245 5.96996 7.71523 5.84214 7.63162 5.71214L0.545467 13.1549C-0.164815 13.9011 -0.183982 15.1608 0.502966 15.9339C1.18991 16.7071 2.30992 16.6855 2.97326 15.8861L9.58802 7.91525C9.47802 7.82432 9.36857 7.73182 9.27024 7.62119L7.90523 6.08558Z"
              fill="#A0A0A0"
            />
          </svg>
        </Box>
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
        <Value ml="20px">execution_2</Value>
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
