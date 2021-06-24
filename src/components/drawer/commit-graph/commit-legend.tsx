// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC } from 'react';
import { Box, Flex } from 'rebass';
import { Labeling, Label } from '@logicalclocks/quartz';

import circleStyles from './commit-legend.styles';
import { CommitDetails } from './bar-chart';

export interface CommitLegendProps {
  values: CommitDetails | null;
  type?: string;
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
  type,
  ...props
}: CommitLegendProps) => (
  <Flex {...props} mt="10px" flexDirection="column">
    <Flex flexDirection="row">
      {keys.map((key: string, idx: number) => (
        <Flex key={`legend-${key}`} mr="12px">
          <Box mr="5px" mt="3px" sx={circleStyles(colors[idx])} />
          <Label>{values ? values[key] : ''}</Label>
          <Labeling ml="5px">{key}</Labeling>
        </Flex>
      ))}
    </Flex>
    <Flex key={`legend-${groupKey}`} mt="20px" justifyContent="space-between">
      <Label>
        {type === 'executions' ? 'Number of execution' : 'Commits over time'}
      </Label>
      {type === 'executions' ? (
        <Labeling mr="5px">
          {values ? values[groupKey] : `last 30 day${amount === 1 ? '' : 's'}`}
        </Labeling>
      ) : (
        <Labeling mr="5px">
          {values
            ? values[groupKey]
            : `${amount} last commit${amount === 1 ? '' : 's'}`}
        </Labeling>
      )}
    </Flex>
  </Flex>
);

export default CommitLegend;
