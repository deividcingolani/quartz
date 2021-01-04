import { Box, Flex } from 'rebass';
import React, { ComponentType, FC, memo } from 'react';
import { Row as QRow, Card, Value, Labeling } from '@logicalclocks/quartz';

// Types
import provenanceListStyles from './provenance-list-styles';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import useProvenanceListRowData from './useProvenanceListRowData';
import { TrainingDatasetProvenance } from '../../../../types/training-dataset';

export interface FeatureListProps {
  data: TrainingDatasetProvenance[];
}

const Row = memo(QRow);

const Provenance: FC<FeatureListProps> = ({ data }) => {
  const currentProject = useSelector((state: RootState) => state.project);

  const [groupComponents, groupProps] = useProvenanceListRowData(
    data,
    currentProject,
  );

  if (!data?.length) {
    return (
      <Card mt="30px" title="Provenance">
        <Box mt="20px" mx="-20px">
          <Flex height="50px" mt="30px" justifyContent="center">
            <Labeling fontSize="18px" gray>
              This training dataset has no origin feature group
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
          This training dataset use
        </Value>
        <Value primary>{data.length}</Value>
        <Value fontFamily="Inter" ml="5px">
          {data.length > 1 ? '  feature groups' : '  feature group'}
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
