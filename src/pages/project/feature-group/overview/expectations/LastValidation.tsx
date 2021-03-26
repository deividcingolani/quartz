import React, { FC } from 'react';
import { Box, Flex, FlexProps } from 'rebass';
import { Labeling, Microlabeling, Value } from '@logicalclocks/quartz';

export interface LastValidationProps extends Omit<FlexProps, 'css'> {
  success: number;
  warning: number;
  alert: number;
}

const LastValidation: FC<LastValidationProps> = ({
  success,
  warning,
  alert,
  ...props
}) => {
  return (
    <Flex width="110px" {...props}>
      <Box mr="8px">
        <Microlabeling gray>success</Microlabeling>
        {!!success ? (
          <Value primary>{success}</Value>
        ) : (
          <Labeling bold gray>
            0
          </Labeling>
        )}
      </Box>
      <Box mr="8px">
        <Microlabeling gray>warning</Microlabeling>
        {!!warning ? (
          <Value color="labels.orange">{alert}</Value>
        ) : (
          <Labeling bold gray>
            0
          </Labeling>
        )}
      </Box>
      <Box>
        <Microlabeling gray>alert</Microlabeling>
        {!!alert ? (
          <Value color="labels.red">{alert}</Value>
        ) : (
          <Labeling bold gray>
            0
          </Labeling>
        )}
      </Box>
    </Flex>
  );
};

export default LastValidation;
