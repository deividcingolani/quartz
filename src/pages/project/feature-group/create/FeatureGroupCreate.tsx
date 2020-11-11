import React, { FC } from 'react';
import { useParams } from 'react-router-dom';

const FeatureGroupCreate: FC = () => {
  const { id: projectId } = useParams();

  return <div>Create a New Feature Group For the project:{projectId}</div>;
};

export default FeatureGroupCreate;
