import React, { FC } from 'react';
import { Box, Flex } from 'rebass';
import { Labeling, Label } from '@logicalclocks/quartz';

import circleStyles from './commit-legend.styles';
import { CommitDetails } from './bar-chart';

export interface CommitLegendProps {
  values: CommitDetails | null;
  groupKey: string;
  keys: string[];
  amount: number;
  colors: string[];
}

const CommitLegend: FC<CommitLegendProps> = ({
  values,
  groupKey,
  keys,
  amount,
  colors,
  ...props
}: CommitLegendProps) => (
  <Flex {...props} mt="10px" flexDirection="column">
    <Flex flexDirection="row">
      {keys.map((key: string, idx: number) => (
        <Flex key={`legend-${key}`} ml="12px">
          <Box mr="5px" mt="3px" sx={circleStyles(colors[idx])} />
          <Labeling>{key}</Labeling>
          <Label ml="5px">{values ? values[key] : ''}</Label>
        </Flex>
      ))}
    </Flex>
    <Flex
      key={`legend-${groupKey}`}
      mt="20px"
      ml="12px"
      justifyContent="space-between"
    >
      <Label>Commits over time</Label>
      <Labeling mr="5px">
        {values
          ? values[groupKey]
          : `${amount} last commit${amount === 1 ? '' : 's'}`}
      </Labeling>
    </Flex>
  </Flex>
);

export default CommitLegend;
