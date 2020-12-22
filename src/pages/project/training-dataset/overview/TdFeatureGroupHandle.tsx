import { Labeling } from '@logicalclocks/quartz';
import React, { FC, memo } from 'react';
import { Flex } from 'rebass';
import { FeatureGroup } from '../../../../types/feature-group';

export interface TdFeatureGroupHandleProps {
  featureGroup?: FeatureGroup;
}

const TdFeatureGroupHandle: FC<TdFeatureGroupHandleProps> = ({
  featureGroup,
}) => {
  if (!featureGroup) {
    return (
      <Labeling bold gray>
        unavailable origin feature group
      </Labeling>
    );
  }

  return (
    <Flex>
      <Labeling>{featureGroup.name}</Labeling>
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
