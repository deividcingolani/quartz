import React, { FC, useMemo, useState } from 'react';
import { Flex } from 'rebass';

import CommitLegend from './commit-legend';
import BarChart, { CommitDetails } from './bar-chart';

const graphColors = ['labels.green', 'labels.red', 'labels.orange'];
const backgroundColor = 'grayShade3';
const typeForActivity = {
  commits: 'commits',
  executions: 'executions',
};
export interface CommitGraphProps {
  values: CommitDetails[];
  groupKey: string;
  keys: string[];
  type?: string;
}

const CommitGraph: FC<CommitGraphProps> = ({
  values,
  groupKey,
  keys,
  type,
  ...props
}: CommitGraphProps) => {
  const [selected, setSelected] = useState<number | null>(null);
  const preparedData = useMemo(() => {
    // Keep the bars with the same disposition even if there are less than 10;
    if (type === typeForActivity.executions) {
      if (values.length >= 30) {
        return values;
      }
      const executionsByDay: CommitDetails[] = new Array(30 - values.length)
        .fill(null)
        .map((__x, idx) => ({
          date: idx.toString(),
          'executions by day': null,
          deleted: null,
          modified: null,
        }));
      return values.concat(executionsByDay);
    }
    if (values.length >= 10) {
      return values;
    }
    const added: CommitDetails[] = new Array(10 - values.length)
      .fill(null)
      .map((__x, idx) => ({
        date: idx.toString(),
        added: null,
        deleted: null,
        modified: null,
      }));
    return values.concat(added);
  }, [values, type]);
  return (
    <Flex {...props} flexDirection="column" width="100%">
      {/* D3 chart */}
      <BarChart
        values={preparedData}
        keys={keys}
        groupKey={groupKey}
        backgroundColor={backgroundColor}
        colors={graphColors}
        onSelect={setSelected}
        type={type}
      />
      {/* Legend */}
      <CommitLegend
        keys={keys}
        groupKey={groupKey}
        amount={values.length}
        colors={graphColors}
        values={selected !== null ? values[selected] : null}
        type={type}
      />
    </Flex>
  );
};

export default CommitGraph;
