import React, { FC } from 'react';

export interface FeatureGroupCreateProps {
  projectId: number;
}

const FeatureGroupCreate: FC<FeatureGroupCreateProps> = ({
  projectId,
}: FeatureGroupCreateProps) => {
  return <div>Create a New Feature Group For the project:{projectId}</div>;
};

export default FeatureGroupCreate;
