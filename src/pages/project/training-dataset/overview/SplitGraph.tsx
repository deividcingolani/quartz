import React, { FC, useMemo } from 'react';
import { Card, Labeling, SplitGraph as Splits } from '@logicalclocks/quartz';
import { Split } from '../../../../types/training-dataset';
import { Box, Flex } from 'rebass';

export interface SplitGraphProps {
  graph: Split[];
}

const SplitGraph: FC<SplitGraphProps> = ({ graph }) => {
  const mapped = useMemo(
    () =>
      graph.map(({ name, percentage }) => ({
        label: name,
        value: percentage * 100,
      })),
    [graph],
  );

  if (!mapped.length) {
    return (
      <Card title="Splits" mt="20px" mb="20px">
        <Box mt="20px" mx="-20px">
          <Flex height="50px" mt="30px" justifyContent="center">
            <Labeling fontSize="18px" gray>
              This training dataset is not splitted
            </Labeling>
          </Flex>
        </Box>
      </Card>
    );
  }

  return (
    <Card title="Splits" mt="20px" mb="20px">
      <Splits values={mapped} />
    </Card>
  );
};

export default SplitGraph;
