import { Box, Flex } from 'rebass';
import React, { FC } from 'react';
import { Labeling, Value, User } from '@logicalclocks/quartz';
import { ActivityItemData } from '../../../types/feature-group';
import ProfileService from '../../../services/ProfileService';

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
      <Flex alignItems="center">
        <Box ml="20px">
          <svg
            width="16"
            height="21"
            viewBox="0 0 16 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.00047 6.64293C9.84214 6.64293 11.3338 5.20453 11.3338 3.42864C11.3338 1.65275 9.84214 0.214355 8.00047 0.214355C6.1588 0.214355 4.66714 1.65275 4.66714 3.42864C4.66714 5.20453 6.1588 6.64293 8.00047 6.64293ZM5.77547 16.6394L6.84214 15.3536L4.27964 13.2965L2.36714 15.6027C1.89214 16.1733 1.87964 16.9849 2.3338 17.5715L4.3338 20.1429C4.66297 20.5648 5.16297 20.7858 5.66714 20.7858C6.01297 20.7858 6.36714 20.6813 6.66714 20.4644C7.40464 19.934 7.55047 18.9255 7.00047 18.2144L5.77547 16.6394ZM11.7213 13.2965L9.1588 15.3536L10.2255 16.6394L9.00047 18.2144C8.45047 18.9255 8.5963 19.934 9.3338 20.4644C9.6338 20.6813 9.9838 20.7858 10.3338 20.7858C10.8421 20.7858 11.3421 20.5648 11.6671 20.1429L13.6671 17.5715C14.1213 16.9849 14.1088 16.1733 13.6338 15.6027L11.7213 13.2965ZM15.6963 6.04025C15.1671 5.31302 14.1296 5.14025 13.3755 5.6465L11.6838 6.79159C9.48797 8.2782 6.5088 8.2782 4.31714 6.79159L2.62547 5.65052C1.8713 5.14025 0.833804 5.31703 0.304637 6.04025C-0.224529 6.76748 -0.0411961 7.76793 0.708804 8.2782L2.40047 9.42328C3.1088 9.90141 3.87547 10.263 4.66714 10.5443V11.7858H11.3338V10.5483C12.1255 10.267 12.8921 9.90543 13.6005 9.4273L15.2921 8.28221C16.0463 7.76793 16.2255 6.76748 15.6963 6.04025Z"
              fill="#A0A0A0"
            />
          </svg>
        </Box>
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
