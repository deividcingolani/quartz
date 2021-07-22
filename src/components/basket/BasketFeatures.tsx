// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { ComponentType, FC, memo } from 'react';
import { Row, Text, Collapse, Labeling } from '@logicalclocks/quartz';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch, RootState } from '../../store';
import { FeatureGroup } from '../../types/feature-group';
import useFeaturesListRowData from './useFeaturesListRowData';

import { remove } from '../../sources/basketSvg';

import stickyStyles from './basket-features.styles';
import { Feature } from '../../types/feature';

export interface BasketFeaturesProps {
  data: Feature[];
  projectId: number;
  parent: FeatureGroup;
}

const BasketFeatures: FC<BasketFeaturesProps> = ({
  data,
  parent,
  projectId,
}) => {
  const dispatch = useDispatch<Dispatch>();

  const { id: userId } = useSelector((state: RootState) => state.profile);

  const [featureComponents, featureProps] = useFeaturesListRowData(
    data,
    parent,
    userId,
    projectId,
  );

  const { name } = parent;

  return (
    <Collapse
      isOpenProps
      sx={stickyStyles}
      title={<Labeling ml="8px">{name}</Labeling>}
      secondaryContent={
        <Text
          mr="11px"
          onClick={(e) => {
            e.stopPropagation();
            dispatch.basket.deleteFeatures({
              features: data,
              featureGroup: parent,
              projectId: +projectId,
              userId,
            });
          }}
        >
          {remove.featureGroup}
        </Text>
      }
    >
      <Row
        middleColumn={0}
        groupComponents={featureComponents as ComponentType<any>[][]}
        groupProps={featureProps}
      />
    </Collapse>
  );
};

export default memo(BasketFeatures);
