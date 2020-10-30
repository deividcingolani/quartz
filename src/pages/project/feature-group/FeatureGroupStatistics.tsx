import React, { FC } from 'react';
import { useParams } from 'react-router-dom';

const FeatureGroupStatistics: FC = () => {
  const { fgId } = useParams();

  return <div>Feature Group Statistics {fgId}</div>;
};

export default FeatureGroupStatistics;
