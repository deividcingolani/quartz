import { Flex } from 'rebass';
import { useTheme } from 'emotion-theming';
import { Labeling } from '@logicalclocks/quartz';
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  LabelProps,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
// eslint-disable-next-line import/no-unresolved
import { ITheme } from '@logicalclocks/quartz/dist/theme/types';
import React, { FC, useCallback, useMemo, useState } from 'react';

// Utils
import randomArrayString from '../../../../../utils/randomArrayString';
// Styles
import styles from './styles';
import { ChartProps } from './types';
import { ItemDrawerTypes } from '../../../../../components/drawer/ItemDrawer';

const renderCustomizedLabel = (count: number, theme: ITheme) => ({
  x = 0,
  y,
  width = 0,
  height = 0,
  value = '',
  fill,
}: LabelProps) => {
  const isFit = value.toString().length * 24 + 30 < width;

  const dx = isFit ? width / 2 : x + width - 15;

  const formattedValue = Math.ceil((+value / count) * 1000) / 10;

  return (
    <g>
      <text
        x={x}
        y={y}
        dy={height / 2 + 1}
        dx={dx}
        fill={
          fill === theme.colors.black && isFit
            ? theme.colors.white
            : theme.colors.black
        }
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Inter"
        fontSize="12px"
      >
        {`${value} (${formattedValue.toFixed(2)}%)`}
      </text>
    </g>
  );
};

const renderCustomizedTick = () => ({ x, y, payload: { value } }: any) => {
  const maxLength = 8;
  const partsLength = Math.ceil(value.length / maxLength);
  return (
    <>
      {Array.from({ length: partsLength })
        .fill(0)
        .map((_, ind) => {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <g key={ind}>
              <text
                x={x}
                y={y}
                dx={x - 109}
                dy={
                  partsLength > 1
                    ? ind * 10 - 4 * Math.ceil(partsLength / 2)
                    : 2
                }
                textAnchor="left"
                dominantBaseline="middle"
                fontFamily="Inter"
                fontSize="10px"
              >
                {value.substring(ind * maxLength, maxLength * (ind + 1))}
              </text>
            </g>
          );
        })}
    </>
  );
};

const HorizontalBarChart: FC<ChartProps> = ({ data, dataType }) => {
  const theme = useTheme<ITheme>();

  const mappedData = useMemo(
    () =>
      data.map(({ value, ...rest }) => ({
        value: value.toString().substring(0, 24),
        ...rest,
      })),
    [data],
  );

  const keys = useMemo(() => randomArrayString(mappedData.length), [
    mappedData,
  ]);
  const [focusBar, setFocusBar] = useState(null);

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

  const sum = useMemo(() => {
    return mappedData.reduce((acc, { count }) => acc + count, 0);
  }, [mappedData]);

  return (
    <Flex
      ml={dataType === ItemDrawerTypes.fg ? 'auto' : 'initial'}
      alignItems="center"
      flexDirection="column"
      sx={styles.container}
    >
      <Flex flexDirection="row" sx={styles.horizontal.chartWrapper}>
        <BarChart
          layout="vertical"
          width={260}
          height={mappedData.length * 32}
          data={mappedData}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          barCategoryGap={10}
        >
          <XAxis type="number" hide />
          <YAxis
            interval={0}
            type="category"
            dataKey="value"
            axisLine={false}
            tickLine={false}
            tick={renderCustomizedTick()}
          />
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
            <LabelList
              dataKey="count"
              content={renderCustomizedLabel(sum, theme)}
            />
          </Bar>
          <Tooltip content={() => null} active={false} cursor={false} />
        </BarChart>
      </Flex>
      <Labeling bold mt="20px">
        distribution of values
      </Labeling>
    </Flex>
  );
};

export default HorizontalBarChart;
