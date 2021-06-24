// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useMemo } from 'react';
import { Box, Flex } from 'rebass';
import { Labeling, Tooltip, Value } from '@logicalclocks/quartz';

import { ActivityItemData } from '../../../types/feature-group';
import LastValidation from '../../../pages/project/feature-group/overview/expectations/LastValidation';
import { getStatusCountForActivity } from '../utils';
import icons from '../../../sources/icons';

export interface DataValidationProps {
  activity: ActivityItemData;
  onButtonClick?: (activity: ActivityItemData) => void;
}

const DataValidation: FC<DataValidationProps> = ({
  activity,
  onButtonClick,
}) => {
  const successCount = useMemo(
    () => getStatusCountForActivity('SUCCESS', activity),
    [activity],
  );

  const warningCount = useMemo(
    () => getStatusCountForActivity('WARNING', activity),
    [activity],
  );

  const alertCount = useMemo(
    () => getStatusCountForActivity('FAILURE', activity),
    [activity],
  );

  const toMsg = (status: string): string => {
    switch (status) {
      case 'SUCCESS':
        return 'succeeded';
      case 'FAILURE':
        return 'alerted';
      default:
        return 'warned';
    }
  };

  const message = useMemo(
    () =>
      `${activity.validations.expectationResults[0].expectation.features.join(
        ', ',
      )} ${toMsg(activity.validations.expectationResults[0].status)}`,
    [activity],
  );

  return (
    <Flex
      bg="white"
      height="56px"
      alignItems="center"
      justifyContent="space-between"
      onClick={() => onButtonClick && onButtonClick(activity)}
    >
      <Flex
        sx={{
          alignItems: 'center',
        }}
      >
        <Box mt="2px" ml="16px">
          {icons.data_validation}
        </Box>
        <Labeling width="110px" ml="4px" bold gray>
          Validation
        </Labeling>

        <LastValidation
          ml="20px"
          alert={alertCount}
          success={successCount}
          warning={warningCount}
        />

        <Value
          ml="20px"
          sx={{
            lineHeight: '22px',
          }}
        >
          {message}
        </Value>
      </Flex>

      <Tooltip mr="20px" mainText="Open">
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
              width: '20px',
              height: '20px',
            },
          }}
        >
          {icons.eye}
        </Box>
      </Tooltip>
    </Flex>
  );
};

export default DataValidation;
