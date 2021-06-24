// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo } from 'react';
import { Flex } from 'rebass';
import { Button, Labeling } from '@logicalclocks/quartz';

import { FeatureGroup } from '../../../../types/feature-group';
import useGetHrefForRoute from '../../../../hooks/useGetHrefForRoute';

export interface TdFeatureGroupHandleProps {
  featureGroup?: FeatureGroup;
}

const TdFeatureGroupHandle: FC<TdFeatureGroupHandleProps> = ({
  featureGroup,
}) => {
  const getHref = useGetHrefForRoute();

  if (!featureGroup) {
    return (
      <Labeling bold gray>
        unavailable origin feature group
      </Labeling>
    );
  }

  return (
    <Flex>
      <Button
        my="-8px"
        mx="-15px"
        intent="inline"
        onClick={() =>
          window.open(getHref(`/fg/${featureGroup?.id}`, 'p/:id/*'), '_blank')
        }
      >
        {featureGroup.name} ↗
      </Button>
      <Labeling ml="3px" gray>
        v{featureGroup.version}
      </Labeling>
      <Labeling ml="3px" color="labels.orange">
        #{featureGroup.id}
      </Labeling>
    </Flex>
  );
};

export default memo(TdFeatureGroupHandle);
