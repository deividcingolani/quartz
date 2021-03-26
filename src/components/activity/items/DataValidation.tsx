import { Box, Flex } from 'rebass';
import React, { FC, useMemo } from 'react';
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

  const message = useMemo(
    () =>
      `${activity.validations.expectationResults[0].expectation.features.join(
        ', ',
      )} ${
        activity.validations.expectationResults[0].status === 'SUCCESS'
          ? 'succeeded'
          : activity.validations.expectationResults[0].status === 'FAILURE'
          ? 'alerted'
          : 'warned'
      }`,
    [activity],
  );

  return (
    <Flex
      bg="white"
      height="56px"
      alignItems="center"
      justifyContent="space-between"
    >
      <Flex>
        <Box mt="5px" ml="20px">
          <svg
            width="16"
            height="17"
            viewBox="0 0 16 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.7809 5.9623L14.5434 4.7248C14.2496 4.43105 13.7746 4.43105 13.484 4.7248L5.99961 12.2092L2.51836 8.7248C2.22461 8.43106 1.74961 8.43106 1.45898 8.7248L0.218359 9.96543C-0.0753906 10.2592 -0.0753906 10.7342 0.218359 11.0279L5.46836 16.2811C5.76211 16.5748 6.23711 16.5748 6.52773 16.2811L15.7777 7.0248C16.0715 6.72793 16.0715 6.25293 15.7809 5.9623ZM5.64648 9.2748C5.84023 9.47168 6.15898 9.47168 6.35273 9.2748L12.8527 2.76855C13.0465 2.57168 13.0465 2.25605 12.8527 2.0623L11.4402 0.64668C11.2465 0.449805 10.9277 0.449805 10.734 0.64668L5.99961 5.38105L4.26836 3.64668C4.07461 3.4498 3.75586 3.4498 3.56211 3.64668L2.14648 5.0623C1.95273 5.25918 1.95273 5.5748 2.14648 5.76855L5.64648 9.2748Z"
              fill="#A0A0A0"
            />
          </svg>
        </Box>
        <Labeling mt="5px" width="110px" bold ml="8px" gray>
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
          onClick={() => onButtonClick && onButtonClick(activity)}
        >
          {icons.eye}
        </Box>
      </Tooltip>
    </Flex>
  );
};

export default DataValidation;
