import React, { FC } from 'react';
import { useParams } from 'react-router-dom';

const FeatureGroupDataCorrelation: FC = () => {
  const { fgId } = useParams();

  return <div>Feature Group Data Correlation {fgId}</div>;
};

export default FeatureGroupDataCorrelation;
