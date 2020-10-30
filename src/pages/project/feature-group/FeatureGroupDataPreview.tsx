import React, { FC } from 'react';
import { useParams } from 'react-router-dom';

const FeatureGroupDataPreview: FC = () => {
  const { fgId } = useParams();

  return <div>Feature Group Data Preview {fgId}</div>;
};

export default FeatureGroupDataPreview;
