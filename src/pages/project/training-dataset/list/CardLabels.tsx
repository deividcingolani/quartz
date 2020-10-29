import React, { FC, memo } from 'react';
import { Badge } from '@logicalclocks/quartz';

export interface ICardLabelsProps {
  labels?: string[];
  isLoading: boolean;
}

const CardLabels: FC<ICardLabelsProps> = ({
  labels,
  isLoading,
}: ICardLabelsProps) => {
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
