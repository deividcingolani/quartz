// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback, useMemo } from 'react';
import { Flex } from 'rebass';
import { useTheme } from 'emotion-theming';
import { Labeling, ITheme } from '@logicalclocks/quartz';
import { Cell, Legend, Pie, PieChart } from 'recharts';

// Types
import randomArrayString from '../../../../../utils/randomArrayString';
import { ChartProps } from './types';
// Styles
import styles from './styles';

const DonutChart: FC<ChartProps> = ({ data }) => {
  const theme = useTheme<ITheme>();

  const colors = useMemo(() => Object.values(theme.colors.labels), [theme]);
  const keys = useMemo(() => randomArrayString(data.length), [data]);

  const formatter = useCallback((_, entry) => {
    const { payload } = entry;

    return `${payload.payload.value} (${(payload.percent * 100).toFixed(2)}%)`;
  }, []);

  const mappedData = useMemo(
    () =>
      data.map(({ value, ...rest }) => ({
        value: value === 'true',
        ...rest,
      })),
    [data],
  );

  return (
    <Flex
      flexDirection="column"
      height="max-content"
      alignItems="center"
      sx={styles.donut}
    >
      <PieChart width={251} height={171}>
        <Pie
          isAnimationActive={false}
          data={mappedData}
          cx={120}
          cy={200}
          labelLine={false}
          innerRadius={40}
          outerRadius={80}
          fill={theme.colors.primary}
          dataKey="count"
          paddingAngle={4}
        >
          {data.map((_, index) => (
            <Cell key={keys[index]} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Legend iconType="circle" formatter={formatter} />
      </PieChart>
      <Labeling bold mt="20px">
        distribution of values
      </Labeling>
    </Flex>
  );
};

export default DonutChart;
