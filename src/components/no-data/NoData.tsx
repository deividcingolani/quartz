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
          sx={{
            color: !isFilter ? 'gray' : 'black',
          }}
        >
          {mainText}
        </Value>
      )}
      {!!mainText && !isFilter && secondaryText && (
        <Text fontFamily="Inter" mt="8px">
          {secondaryText}
        </Text>
      )}
      {children && <Flex mt="60px">{children}</Flex>}
    </Flex>
  );
};

export default NoData;
