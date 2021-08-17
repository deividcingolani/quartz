// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Flex } from 'rebass';
import { useTheme } from 'emotion-theming';
import { Labeling, ITheme } from '@logicalclocks/quartz';
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
// Utils
import randomArrayString from '../../../../../utils/randomArrayString';
// Styles
import styles from './styles';
import { ChartProps } from './types';

const renderCustomizedLabel =
  (count: number, theme: ITheme) =>
  ({ x = 0, y = 0, width = 0, height = 0, value = '', fill }: LabelProps) => {
    const isFit = value.toString().length * 24 + 30 < width;
    const formattedValue = Math.ceil((+value / count) * 1000) / 10;

    const dx = (): number => {
      if (width > 14) {
        return width - 26;
      }
      return width + 26;
    };

    return (
      <g style={{}}>
        <text
          x={x}
          y={y}
          dy={height / 2 + 1}
          dx={dx()}
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
          {`${value} (${formattedValue}%)`}
        </text>
      </g>
    );
  };

const renderEndLine =
  () =>
  ({ y = 0, width = 0, height = 0 }: LabelProps) => {
    return (
      <g>
        <foreignObject
          x={width}
          y={y}
          width={66}
          height={23}
          dy={height / 2 + 1}
        >
          <div
            style={{
              height: 23,
              borderRightColor: 'black',
              borderRightStyle: 'solid',
              borderRightWidth: '1px',
            }}
          />
        </foreignObject>
        <Cell />
      </g>
    );
  };

const renderCustomizedTick =
  () =>
  ({ x, y, payload: { value } }: any) => {
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
                <foreignObject
                  width={52}
                  height={30}
                  x={x - 50}
                  y={y - 6}
                  dy={
                    partsLength > 1
                      ? ind * 10 - 4 * Math.ceil(partsLength / 2)
                      : 2
                  }
                >
                  <div
                    style={{
                      height: 30,
                      width: 52,
                      fontFamily: 'Inter',
                      fontSize: '10px',
                      textAlign: 'end',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                    }}
                  >
                    {value.substring(ind * maxLength, maxLength * (ind + 1))}
                  </div>
                </foreignObject>
              </g>
            );
          })}
      </>
    );
  };

const HorizontalBarChart: FC<ChartProps> = ({ data }) => {
  const theme = useTheme<ITheme>();

  const mappedData = useMemo(
    () =>
      data.map(({ value, ...rest }) => ({
        value: value.toString().substring(0, 24),
        ...rest,
      })),
    [data],
  );

  useEffect(() => {
    mappedData.sort((firstValue: any, secondValue: any) => {
      if (secondValue.count > firstValue.count) {
        return 1;
      }
      if (secondValue.count < firstValue.count) {
        return -1;
      }
      if (secondValue.value > firstValue.value) {
        return 1;
      }
      if (secondValue.value < firstValue.value) {
        return -1;
      }
      return 0;
    });
  }, [mappedData]);

  const keys = useMemo(
    () => randomArrayString(mappedData.length),
    [mappedData],
  );
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
    <Flex alignItems="center" flexDirection="column" sx={styles.container}>
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
            fill={theme.colors.grayShade1}
          >
            {mappedData.map((_, index) => {
              return (
                <Cell
                  key={keys[index]}
                  fill={
                    focusBar === index
                      ? theme.colors.grayShade1
                      : theme.colors.grayShade2
                  }
                  height={23}
                />
              );
            })}
            <LabelList
              dataKey="count"
              content={renderCustomizedLabel(sum, theme)}
            />
            <LabelList
              dataKey="count"
              position="insideTop"
              content={renderEndLine()}
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
