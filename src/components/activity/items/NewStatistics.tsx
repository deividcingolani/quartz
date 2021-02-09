import React, { FC } from 'react';
import { Box, Flex } from 'rebass';
import ProfileService from '../../../services/ProfileService';
import { ActivityItemData } from '../../../types/feature-group';
import { IconButton, Labeling, User, Value } from '@logicalclocks/quartz';

export interface NewStatisticsProps {
  activity: ActivityItemData;
  onButtonClick?: (commitTime?: number) => void;
}

export const iconStyles = {
  button: {
    border: 'none',
    svg: {
      width: '10px !important',
    },
  },
  span: {
    ml: '-7px',
  },
};

const NewStatistics: FC<NewStatisticsProps> = ({ activity, onButtonClick }) => {
  return (
    <Flex
      bg="white"
      height="56px"
      alignItems="center"
      justifyContent="space-between"
    >
      <Flex>
        <Box ml="20px">
          <svg
            width="16"
            height="13"
            viewBox="0 0 16 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.4 9.5H13.1C13.3 9.5 13.5 9.3 13.5 9.1V1.9C13.5 1.7 13.3 1.5 13.1 1.5H12.4C12.2 1.5 12 1.7 12 1.9V9.1C12 9.3 12.2 9.5 12.4 9.5ZM6.4 9.5H7.1C7.3 9.5 7.5 9.3 7.5 9.1V2.9C7.5 2.7 7.3 2.5 7.1 2.5H6.4C6.2 2.5 6 2.7 6 2.9V9.1C6 9.3 6.2 9.5 6.4 9.5ZM9.4 9.5H10.1C10.3 9.5 10.5 9.3 10.5 9.1V4.9C10.5 4.7 10.3 4.5 10.1 4.5H9.4C9.2 4.5 9 4.7 9 4.9V9.1C9 9.3 9.2 9.5 9.4 9.5ZM15.5 11H1.5V1C1.5 0.72375 1.27625 0.5 1 0.5H0.5C0.22375 0.5 0 0.72375 0 1V11.5C0 12.0522 0.447812 12.5 1 12.5H15.5C15.7762 12.5 16 12.2762 16 12V11.5C16 11.2238 15.7762 11 15.5 11ZM3.4 9.5H4.1C4.3 9.5 4.5 9.3 4.5 9.1V6.9C4.5 6.7 4.3 6.5 4.1 6.5H3.4C3.2 6.5 3 6.7 3 6.9V9.1C3 9.3 3.2 9.5 3.4 9.5Z"
              fill="#A0A0A0"
            />
          </svg>
        </Box>
        <Labeling width="110px" bold ml="8px" gray>
          New statistics
        </Labeling>
        <Labeling ml="120px">commit</Labeling>
        <Value ml="5px">{activity.statistics.commitTime}</Value>
      </Flex>

      <Flex>
        <Box mr="20px">
          <User
            photo={ProfileService.avatar(String(activity.user.email))}
            name={activity.user.firstname}
          />
        </Box>
        <Box mr="15px" sx={iconStyles}>
          <IconButton
            icon="search"
            tooltip="open statistics"
            onClick={() =>
              onButtonClick && onButtonClick(+activity.statistics.commitTime)
            }
          />
        </Box>
      </Flex>
    </Flex>
  );
};

export default NewStatistics;
