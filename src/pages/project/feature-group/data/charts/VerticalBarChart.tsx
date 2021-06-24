// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback, useMemo, useState } from 'react';
import { Flex } from 'rebass';
import { useTheme } from 'emotion-theming';
import { Labeling } from '@logicalclocks/quartz';
import { Bar, BarChart, Cell, Tooltip } from 'recharts';
// eslint-disable-next-line import/no-unresolved
import { ITheme } from '@logicalclocks/quartz/dist/theme/types';

// Utils
import randomArrayString from '../../../../../utils/randomArrayString';
// Styles
import styles from './styles';
import { ChartProps } from './types';

export interface ChartTooltipProps {
  payload?: {
    payload: {
      value: number;
      count: number;
    };
  }[];
}

const ChartTooltip: FC<ChartTooltipProps> = ({ payload = [] }) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [{ payload: data } = {}] = payload;

  return (
    <Flex flexDirection="column">
      <Flex>
        <Labeling gray bold>
          value:
        </Labeling>
        <Labeling bold ml="2px">
          {data?.value || '-'}
        </Labeling>
      </Flex>
      <Flex>
        <Labeling gray bold>
          count:
        </Labeling>
        <Labeling bold ml="2px">
          {data?.count || '-'}
        </Labeling>
      </Flex>
    </Flex>
  );
};

const VerticalBarChart: FC<ChartProps> = ({ data }) => {
  const theme = useTheme<ITheme>();

  const mappedData = useMemo(
    () =>
      data.map(({ value, ...rest }) => ({
        value: +value,
        ...rest,
      })),
    [data],
  );

  const keys = useMemo(
    () => randomArrayString(mappedData.length),
    [mappedData],
  );
  const [focusBar, setFocusBar] = useState(null);

  const maxValue = useMemo(
    () => Math.max(...mappedData.map(({ count }) => count)),
    [mappedData],
  );

  const handleMouseMove = useCallback(
    ({ isTooltipActive, activeTooltipIndex }) => {
      if (activeTooltipIndex !== focusBar) {
        if (isTooltipActive) {
          setFocusBar(activeTooltipIndex);
        } else {
          setFocusBar(null);
        }
      }
    },
    [setFocusBar, focusBar],
  );

  const handleMouseLeave = useCallback(() => {
    setFocusBar(null);
  }, [setFocusBar]);

  return (
    <Flex alignItems="center" flexDirection="column" sx={styles.container}>
      <Flex flexDirection="row" sx={styles.vertical.chartWrapper}>
        <div>
          <Labeling gray>{maxValue}</Labeling>
          <Labeling gray>0</Labeling>
        </div>

        <BarChart
          width={215}
          height={171}
          data={mappedData}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <Bar
            isAnimationActive={false}
            dataKey="count"
            fill={theme.colors.primary}
          >
            {mappedData.map((_, index) => {
              return (
                <Cell
                  key={keys[index]}
                  fill={
                    focusBar === index
                      ? theme.colors.black
                      : theme.colors.primary
                  }
                />
              );
            })}
          </Bar>
          <Tooltip
            content={<ChartTooltip />}
            active
            cursor={false}
            wrapperStyle={{
              visibility: 'visible',
              width: '100%',
            }}
          />
        </BarChart>
      </Flex>
      <Labeling bold mt="54px">
        distribution of values
      </Labeling>
    </Flex>
  );
};

export default VerticalBarChart;
