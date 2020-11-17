import React, { FC, memo, ReactNode } from 'react';
import { Flex } from 'rebass';
import { Value } from '@logicalclocks/quartz';
// Components
import ErrorProjectsContent from './ErrorProjectsContent';

export interface ErrorProps {
  errorTitle: string;
  errorMessage: ReactNode;
  actions?: ReactNode;
}

const Error: FC<ErrorProps> = ({ errorTitle, errorMessage, actions }) => {
  return (
    <Flex flexDirection="column" alignItems="center" my="auto">
      <Value fontSize="22px" mb="11px">
        {errorTitle}
      </Value>
      {errorMessage}
      <Flex>
        <ErrorProjectsContent actions={actions} />
      </Flex>
    </Flex>
  );
};

export default memo(Error);
