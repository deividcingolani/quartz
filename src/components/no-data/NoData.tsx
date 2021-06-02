import { Flex } from 'rebass';
import React, { FC } from 'react';
import { Value, Text } from '@logicalclocks/quartz';

export interface NoDataProps {
  mainText?: string;
  secondaryText?: string;
  children?: React.ReactNode;
  isFilter?: boolean;
}

const NoData: FC<NoDataProps> = ({
  mainText,
  secondaryText,
  children,
  isFilter,
}: NoDataProps) => {
  return (
    <Flex flexDirection="column" alignItems="center" my="auto">
      {!!mainText && (
        <Value
          fontFamily="Inter"
          fontSize="18px"
          mb="11px"
          sx={{
            color: !isFilter ? 'gray' : 'black',
          }}
        >
          {mainText}
        </Value>
      )}
      {!!mainText && isFilter && (
        <Text fontFamily="Inter" mb="58px">
          {secondaryText}
        </Text>
      )}
      {!!mainText && !isFilter && (
        <Value fontFamily="Inter" mb="58px">
          {secondaryText}
        </Value>
      )}
      <Flex>{children}</Flex>
    </Flex>
  );
};

export default NoData;
