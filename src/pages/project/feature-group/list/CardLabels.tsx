import { Badge } from '@logicalclocks/quartz';
import React, { FC, memo } from 'react';

export interface CardLabelsProps {
  labels?: string[];
  loading?: boolean;
}

const CardLabels: FC<CardLabelsProps> = ({
  labels,
  loading,
}: CardLabelsProps) => {
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
