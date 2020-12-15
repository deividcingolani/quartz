import React, { FC, memo } from 'react';
import { Badge } from '@logicalclocks/quartz';

export interface ICardLabelsProps {
  labels?: string[];
}

const CardLabels: FC<ICardLabelsProps> = ({ labels }: ICardLabelsProps) => {
  return (
    <>
      {labels?.map((name) => (
        <Badge key={name} ml="5px" value={name} variant="label" />
      ))}
    </>
  );
};

export default memo(CardLabels);
