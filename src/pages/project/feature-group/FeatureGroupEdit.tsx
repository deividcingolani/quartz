import React, { FC } from 'react';
import { useParams } from 'react-router-dom';

const FeatureGroupEdit: FC = () => {
  const { fgId } = useParams();

  return <div>Feature Group Edit {fgId}</div>;
};

export default FeatureGroupEdit;
