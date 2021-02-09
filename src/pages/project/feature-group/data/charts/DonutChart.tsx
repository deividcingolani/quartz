import { Flex } from 'rebass';
import { useTheme } from 'emotion-theming';
import React, { FC, useCallback, useMemo } from 'react';
import { Labeling } from '@logicalclocks/quartz';
import { Cell, Legend, Pie, PieChart } from 'recharts';
// eslint-disable-next-line import/no-unresolved
import { ITheme } from '@logicalclocks/quartz/dist/theme/types';

// Types
import randomArrayString from '../../../../../utils/randomArrayString';
import { ChartProps } from './types';
// Styles
import styles from './styles';
import { ItemDrawerTypes } from '../../../../../components/drawer/ItemDrawer';

const DonutChart: FC<ChartProps> = ({ data, dataType }) => {
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
      ml={dataType === ItemDrawerTypes.fg ? 'auto' : 'initial'}
      flexDirection="column"
      width="max-content"
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
