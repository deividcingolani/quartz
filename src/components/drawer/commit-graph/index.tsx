import React, { FC, useMemo, useState } from 'react';
import { Flex } from 'rebass';

import CommitLegend from './commit-legend';
import BarChart, { CommitDetails } from './bar-chart';

const graphColors = ['labels.green', 'labels.red', 'labels.orange'];
const backgroundColor = 'grayShade3';

export interface CommitGraphProps {
  values: CommitDetails[];
  groupKey: string;
  keys: string[];
}

const CommitGraph: FC<CommitGraphProps> = ({
  values,
  groupKey,
  keys,
  ...props
}: CommitGraphProps) => {
  const [selected, setSelected] = useState<number | null>(null);

  const preparedData = useMemo(() => {
    // Keep the bars with the same disposition even if there are less than 10;
    if (values.length >= 10) {
      return values;
    }
    const added: CommitDetails[] = new Array(10 - values.length)
      .fill(null)
      .map((__x, idx) => ({
        date: idx.toString(),
        added: null,
        removed: null,
        modified: null,
      }));
    return values.concat(added);
  }, [values]);

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
      />
      {/* Legend */}
      <CommitLegend
        keys={keys}
        groupKey={groupKey}
        amount={values.length}
        colors={graphColors}
        values={selected !== null ? values[selected] : null}
      />
    </Flex>
  );
};

export default CommitGraph;
