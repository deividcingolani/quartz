import React, { FC, memo, ReactNode } from 'react';
import { Flex } from 'rebass';
import { Value } from '@logicalclocks/quartz';
// Components
import ErrorProjectsContent from './ErrorProjectsContent';

export interface ErrorProps {
  errorTitle: string;
  errorMessage: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
}

const Error: FC<ErrorProps> = ({
  errorTitle,
  errorMessage,
  actions,
  children,
}) => {
  return (
    <Flex flexDirection="column" alignItems="center" my="auto">
      <Value fontSize="48px" mb="8px" sx={{ color: 'gray' }}>
        {errorTitle}
      </Value>
      <Value fontSize="24px" mb="34px" sx={{ color: 'gray' }}>
        {errorMessage}
      </Value>
      {children && <Flex mb="34px">{children}</Flex>}
      <Flex>
        <ErrorProjectsContent actions={actions} />
      </Flex>
    </Flex>
  );
};

export default memo(Error);
