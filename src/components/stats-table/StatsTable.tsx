import { Value } from '@logicalclocks/quartz';
import React, { FC } from 'react';
import { Flex, FlexProps } from 'rebass';

export interface StatsTableItem {
  title: string;
  value?: string | number;
}

export interface StatsTableProps extends Omit<FlexProps, 'css' | 'data'> {
  data: StatsTableItem[];
}

const StatsTable: FC<StatsTableProps> = ({ data, ...props }) => {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Flex as="ul" p={0} m={0} {...props} flexDirection="column">
      {data.map(({ title, value }) => (
        <Flex
          as="li"
          my="5px"
          flexGrow={1}
          justifyContent="space-between"
          key={title}
        >
          <Value>{title}</Value>
          <Value ml="auto" primary>
            {value || '-'}
          </Value>
        </Flex>
      ))}
    </Flex>
  );
};

export default StatsTable;
