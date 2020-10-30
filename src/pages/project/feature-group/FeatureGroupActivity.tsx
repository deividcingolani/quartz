import React, { FC } from 'react';
import { useParams } from 'react-router-dom';

const FeatureGroupActivity: FC = () => {
  const { fgId } = useParams();

  return <div>Feature Group Activity {fgId}</div>;
};

export default FeatureGroupActivity;
