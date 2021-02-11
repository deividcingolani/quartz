import { Box, Flex } from 'rebass';
import React, { ComponentType, FC, memo } from 'react';
import { Row as QRow, Card, Value, Labeling } from '@logicalclocks/quartz';

// Types
import { FeatureGroupProvenance } from '../../../../types/feature-group';
import useProvenanceListRowData from './useProvenanceListRowData';
import provenanceListStyles from './provenance-list-styles';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';

export interface FeatureListProps {
  data: FeatureGroupProvenance[];
}

const Row = memo(QRow);

const Provenance: FC<FeatureListProps> = ({ data }) => {
  const currentProject = useSelector((state: RootState) => state.project);

  const [groupComponents, groupProps] = useProvenanceListRowData(
    data,
    currentProject,
  );

  const isLoading = useSelector(
    (state: RootState) =>
      state.loading.effects.featureGroupView.loadRemainingData,
  );

  if (isLoading) {
    return (
      <Card mt="30px" title="Provenance">
        <Box mt="20px" mx="-20px">
          <Flex height="50px" mt="30px" justifyContent="center">
            <Labeling fontSize="18px" gray>
              Loading...
            </Labeling>
          </Flex>
        </Box>
      </Card>
    );
  }

  if (!data?.length) {
    return (
      <Card mt="30px" title="Provenance">
        <Box mt="20px" mx="-20px">
          <Flex height="50px" mt="30px" justifyContent="center">
            <Labeling fontSize="18px" gray>
              This feature group is not used in any training dataset
            </Labeling>
          </Flex>
        </Box>
      </Card>
    );
  }

  return (
    <Card mt="30px" title="Provenance">
      <Flex mt="5px" mb="25x">
        <Value fontFamily="Inter" mr="5px">
          This feature group is used in
        </Value>
        <Value primary>{data.length}</Value>
        <Value fontFamily="Inter" ml="5px">
          {data.length > 1 ? ' training datasets' : ' training dataset'}
        </Value>
      </Flex>
      <Box mt="20px" mx="-20px" sx={provenanceListStyles}>
        <Row
          middleColumn={3}
          groupComponents={groupComponents as ComponentType<any>[][]}
          groupProps={groupProps}
        />
      </Box>
    </Card>
  );
};

export default memo(Provenance);
