// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo } from 'react';
import { Flex, FlexProps } from 'rebass';
import { Badge } from '@logicalclocks/quartz';

export interface CardLabelsProps extends Omit<FlexProps, 'css'> {
  labels?: string[];
  loading?: boolean;
}

const CardLabels: FC<CardLabelsProps> = ({
  labels,
  loading,
  ...props
}: CardLabelsProps) => {
  if (loading) {
    return <Badge ml="5px" value="loading..." />;
  }

  return (
    <Flex {...props}>
      {labels?.map((name) => (
        <Badge mr="5px" key={name} value={name} variant="label" />
      ))}
    </Flex>
  );
};

export default memo(CardLabels);
