// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useMemo } from 'react';
import { Box, Flex } from 'rebass';
import { Tooltip, Labeling, User, Value } from '@logicalclocks/quartz';
import { format } from 'date-fns';
import ProfileService from '../../../services/ProfileService';
import { ActivityItemData } from '../../../types/feature-group';
import icons from '../../../sources/icons';

export interface NewStatisticsProps {
  activity: ActivityItemData;
  onButtonClick?: (commitTime?: number) => void;
}

const dateFormat = 'yyyy-MM-dd HH:mm:ss';

const NewStatistics: FC<NewStatisticsProps> = ({ activity, onButtonClick }) => {
  const commitLabel = useMemo(() => {
    return format(+activity.statistics.commitTime, dateFormat);
  }, [activity]);

  return (
    <Flex
      bg="white"
      height="56px"
      alignItems="center"
      justifyContent="space-between"
    >
      <Flex
        ml="20px"
        sx={{
          alignItems: 'center',
        }}
      >
        <Box>{icons.new_stats}</Box>
        <Labeling width="110px" bold ml="8px" gray>
          New statistics
        </Labeling>
        <Labeling ml="150px">commit</Labeling>
        <Value ml="5px">{commitLabel}</Value>
      </Flex>

      <Flex>
        <Box mr="29px">
          <User
            photo={ProfileService.avatar(String(activity.user.email))}
            name={activity.user.firstname}
          />
        </Box>
        <Tooltip mt="5px" mr="21px" mainText="open statistics">
          <Box
            p="5px"
            height="28px"
            sx={{
              cursor: 'pointer',
              backgroundColor: '#ffffff',
              transition: 'all .4s ease',

              ':hover': {
                backgroundColor: 'grayShade3',
              },

              svg: {
                width: '16px',
                height: '16px',
              },
            }}
            onClick={() =>
              onButtonClick && onButtonClick(+activity.statistics.commitTime)
            }
          >
            {icons.more_zoom}
          </Box>
        </Tooltip>
      </Flex>
    </Flex>
  );
};

export default NewStatistics;
