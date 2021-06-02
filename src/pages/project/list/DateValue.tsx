import { format } from 'date-fns';
import React, { FC } from 'react';
import { Flex, FlexProps } from 'rebass';
import { Microlabeling, Value } from '@logicalclocks/quartz';

export interface DateValueProps extends Omit<FlexProps, 'css'> {
  label: string;
  date: Date;
}

const DateValue: FC<DateValueProps> = ({ label, date, ...props }) => {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Flex flexDirection="column" {...props}>
      <Microlabeling mb="3px" gray>
        {label}
      </Microlabeling>
      <Value primary>{format(date, 'dd-MM-yyyy HH:mm:ss')}</Value>
    </Flex>
  );
};

export default DateValue;
