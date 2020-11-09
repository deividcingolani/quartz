import { Flex } from 'rebass';
import React, { FC } from 'react';
import { Value } from '@logicalclocks/quartz';

export interface NoDataProps {
  mainText?: string;
  secondaryText: string;
  children?: React.ReactNode;
}

const NoData: FC<NoDataProps> = ({
  mainText,
  secondaryText,
  children,
}: NoDataProps) => {
  return (
    <Flex flexDirection="column" alignItems="center" my="auto">
      {!!mainText && (
        <Value fontSize="22px" mb="11px">
          {mainText}
        </Value>
      )}
      <Value mb="58px">{secondaryText}</Value>
      <Flex>{children}</Flex>
    </Flex>
  );
};

export default NoData;
