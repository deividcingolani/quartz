import { Badge } from '@logicalclocks/quartz';
import React, { FC, memo } from 'react';

export interface CardLabelsProps {
  labels?: string[];
  isLoading: boolean;
}

const CardLabels: FC<CardLabelsProps> = ({
  labels,
  isLoading,
}: CardLabelsProps) => {
  if (isLoading) {
    return <Badge value="loading..." />;
  }

  return (
    <>
      {labels?.map((name) => (
        <Badge key={name} ml="5px" value={name} variant="label" />
      ))}
    </>
  );
};

export default memo(CardLabels);
