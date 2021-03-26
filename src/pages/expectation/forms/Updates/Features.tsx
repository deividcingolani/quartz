import React, { FC } from 'react';

import Result from './Result';
import Unchanged from './Unchanged';

export interface FeaturesProps {
  data: string[];
  prevData: string[];
}

const Features: FC<FeaturesProps> = ({ data, prevData }) => {
  const isUnchanged = data.every(
    (name) => prevData.includes(name) && data.length === prevData?.length,
  );

  if (isUnchanged) {
    return <Unchanged title="Features" />;
  }

  const newCount = data.filter((name) => !prevData.includes(name)).length;
  const removedCount = prevData.filter((name) => !data.includes(name)).length;

  return (
    <Result title="Features" newCount={newCount} removedCount={removedCount} />
  );
};

export default Features;
