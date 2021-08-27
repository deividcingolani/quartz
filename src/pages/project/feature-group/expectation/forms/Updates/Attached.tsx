// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC } from 'react';

import Result from './Result';
import Unchanged from './Unchanged';
import { FeatureGroup } from '../../../../../../types/feature-group';

export interface AttachedProps {
  data: FeatureGroup[];
  prevData?: FeatureGroup[];
}

const Attached: FC<AttachedProps> = ({ data, prevData }) => {
  const isUnchanged = data.every(
    ({ name }) =>
      prevData?.map(({ name }) => name).includes(name) &&
      data.length === prevData?.length,
  );

  if (isUnchanged) {
    return <Unchanged title="Attached feature groups" />;
  }

  const newCount = data.filter(
    ({ name }) => !prevData?.map(({ name }) => name).includes(name),
  ).length;
  const removedCount = prevData?.filter(
    ({ name }) => !data?.map(({ name }) => name).includes(name),
  ).length;

  return (
    <Result
      newCount={newCount}
      title="Attached feature groups"
      removedCount={removedCount || 0}
    />
  );
};

export default Attached;
