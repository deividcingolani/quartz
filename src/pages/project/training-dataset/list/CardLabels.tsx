import React, { FC, memo } from 'react';
import { Badge } from '@logicalclocks/quartz';

export interface ICardLabelsProps {
  labels?: string[];
  loading?: boolean;
}

const CardLabels: FC<ICardLabelsProps> = ({
  labels,
  loading,
}: ICardLabelsProps) => {
  if (loading) {
    return <Badge ml="5px" value="loading..." />;
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
