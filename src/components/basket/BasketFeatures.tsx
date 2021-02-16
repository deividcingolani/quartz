import { Box, Flex } from 'rebass';
import featureListStyles from './basket.styles';
import React, { ComponentType, FC, useCallback } from 'react';
import { Feature, FeatureGroup } from '../../types/feature-group';
import { useNavigate } from 'react-router-dom';
import useFeaturesListRowData from './useFeaturesListRowData';
import { Drawer, Labeling, Row, Value } from '@logicalclocks/quartz';
import { useDispatch } from 'react-redux';
import { Dispatch } from '../../store';

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
  const [featureComponents, featureProps] = useFeaturesListRowData(
    data,
    parent,
    projectId,
  );

  const navigate = useNavigate();
  const dispatch = useDispatch<Dispatch>();

  const { id, name, version } = parent;

  const handleNavigate = useCallback(() => {
    dispatch.featureStores.fetch({
      projectId,
    });
    navigate(`/p/${projectId}/fg/${id}`);
  }, [dispatch, projectId, id, navigate]);

  return (
    <Drawer.Section title="">
      <Flex width="100%" flexDirection="column">
        <Flex>
          <Value sx={{ cursor: 'pointer' }} onClick={handleNavigate}>
            {name}
          </Value>
          <Value ml="5px" sx={{ color: 'labels.orange' }}>
            #{id}
          </Value>
          <Labeling ml="5px" gray>
            version {version}
          </Labeling>
        </Flex>
        <Box mt="10px" sx={featureListStyles}>
          <Row
            middleColumn={0}
            groupComponents={featureComponents as ComponentType<any>[][]}
            groupProps={featureProps}
          />
        </Box>
      </Flex>
    </Drawer.Section>
  );
};

export default BasketFeatures;
