import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import * as d3 from 'd3';
import { ScaleBand, ScaleLinear } from 'd3';
import { useTheme } from 'emotion-theming';

interface IObjectKeys {
  [key: string]: string | number | null;
}

export interface CommitDetails extends IObjectKeys {
  date: string;
  added: number | null;
  deleted: number | null;
  modified: number | null;
}

export interface KeyValue {
  key: string;
  value: number;
}

export interface BarChartProps {
  values: CommitDetails[];
  groupKey: string;
  keys: string[];
  colors: string[];
  backgroundColor: string;
  onSelect: (selected: number | null) => void;
}

const BarChart: FC<BarChartProps> = ({
  values,
  groupKey,
  keys,
  colors,
  backgroundColor,
  onSelect,
}: BarChartProps) => {
  const theme = useTheme<any>();
  const containerRef = useRef<HTMLDivElement>(null);

  const margin = {
    top: 10,
    right: 20,
    bottom: 10,
    left: 20,
  };

  const [themedColors, themedBackground] = useMemo(() => {
    const themeColors = colors.map(
      (x: string) => theme.colors.labels[x.split('.')[1]],
    );
    const colorsRange = d3.scaleOrdinal().range(themeColors);

    return [colorsRange, theme.colors.backgroundColor];
  }, [colors, theme.colors.backgroundColor, theme.colors.labels]);

  const aspectRatio = 4;
  const min = 0;
  const max = useMemo(
    () =>
      d3.max(values, (d: CommitDetails) => {
        return d3.max(keys, (k: string): any => d[k]);
      }),
    [values, keys],
  );

  const [sufix, setSufix] = useState(max);

  useEffect(() => {
    switch (true) {
      case max > 1000 && max < 1000000:
        setSufix(`${(max / 10000).toFixed(1)}K`);
        break;
      case max > 1000000 && max < 1000000000:
        setSufix(`${(max / 10000000).toFixed(1)}M`);
        break;
      case max > 1000000000:
        setSufix(`${(max / 10000000000).toFixed(1)}B`);
        break;
      default: {
        setSufix(max);
      }
    }
  }, [max]);

  const drawBarChart = useCallback(
    (data: CommitDetails[], containerEl: HTMLElement) => {
      const parent = containerEl.parentElement as HTMLElement;
      const width = parent.offsetWidth;
      const height = width / aspectRatio;

      // Y
      const y: ScaleLinear<number, number> = d3
        .scaleLinear()
        .domain([min, max])
        .nice()
        .rangeRound([height - margin.bottom, margin.top]);

      // GENERAL X
      const x0: ScaleBand<string> = d3
        .scaleBand()
        .domain(data.map((d): any => d[groupKey]))
        .rangeRound([margin.left, width - margin.right])
        .paddingInner(0.5); // padding between groups

      // GROUP X
      const x1: ScaleBand<string> = d3
        .scaleBand()
        .domain(keys)
        .rangeRound([0, x0.bandwidth()])
        .padding(0.05); // padding within groups

      // CONTAINER
      const container: any = d3
        .select(containerEl)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background-color', themedBackground)
        .on('mouseleave', (__ev: MouseEvent) => {
          onSelect(null);
          d3.selectAll('rect')
            .transition()
            .duration(200)
            .ease(d3.easeLinear)
            .style('opacity', 1);
        });

      container
        .append('rect')
        .attr('width', width)
        .attr('class', 'background')
        .attr('height', height)
        .attr('fill', '#F5F5F5');

      container
        .append('g')
        .selectAll('g')
        .data(data)
        .join('g')
        .attr('class', 'commit')
        .attr('id', (__d: CommitDetails, idx: number) => idx)
        .attr(
          'transform',
          (d: CommitDetails) =>
            `translate(${(x0((d[groupKey] || 0).toString()) || 0) + 30},0)`,
        )
        .selectAll('rect')
        .data((d: CommitDetails) => keys.map((key) => ({ key, value: d[key] })))
        .join('rect')
        .attr('x', (d: KeyValue) => x1(d.key))
        .attr('y', (d: KeyValue) => y(d.value))
        .attr('width', x1.bandwidth())
        .attr('height', (d: KeyValue) => y(0) - y(d.value || 0))
        .attr('fill', (d: KeyValue) => themedColors(d.key));

      container.selectAll('g').on('mouseover', (event: MouseEvent) => {
        const targetEl = event?.target as HTMLElement | undefined;
        const parentNode = targetEl?.parentElement;

        if (parentNode) {
          onSelect(parseInt(parentNode.id, 10));
          // Decrease opacity of all commits;
          d3.selectAll('rect').style('opacity', 0.3);
          // Set full opacity for hovered commit;
          d3.select(parentNode).selectChildren().style('opacity', 1);
          d3.select(parentNode).selectChildren().style('fill', 'black');
          // Don't change opacity for background and axis
          d3.selectAll('.axis').style('opacity', 1);
          d3.selectAll('.background').style('opacity', 1);
        }
      });

      container.selectAll('g').on('mouseout', (event: MouseEvent) => {
        const targetEl = event?.target as HTMLElement | undefined;
        const parentNode = targetEl?.parentElement;

        if (parentNode) {
          onSelect(parseInt(parentNode.id, 10));
          d3.select(parentNode).selectChildren().style('fill', '#21B182');
          // Don't change opacity for background and axis
          d3.selectAll('.axis').style('opacity', 1);
          d3.selectAll('.background').style('opacity', 1);
        }
      });

      // Axis

      container
        .append('rect')
        .attr('class', 'axis')
        .attr('x', 10)
        .attr('y', height - 10)
        .attr('width', width)
        .attr('height', 1)
        .style('fill', theme.colors.grayShade2);

      container
        .append('rect')
        .attr('x', 30)
        .attr('y', 10)
        .attr('class', 'axis')
        .attr('width', 1)
        .attr('height', height - 20)
        .style('fill', theme.colors.grayShade2);

      container
        .append('text')
        .attr('x', 20)
        .attr('class', 'axis')
        .attr('y', height - 13)
        .style('fill', theme.colors.gray)
        .attr('font-size', '12px')
        .attr('font-family', 'Inter')
        .text(0);

      container
        .append('text')
        .attr('x', 28)
        .attr('class', 'axis')
        .attr('y', 23)
        .attr('text-anchor', 'end')
        .style('fill', theme.colors.gray)
        .attr('font-size', '12px')
        .attr('font-family', 'Inter')
        .text(sufix);

      return container.node();
    },
    [
      sufix,
      groupKey,
      keys,
      margin.bottom,
      margin.left,
      margin.right,
      margin.top,
      max,
      theme,
      onSelect,
      themedBackground,
      themedColors,
    ],
  );

  useLayoutEffect(() => {
    if (containerRef?.current) {
      const children = d3.select(containerRef?.current).selectChildren();
      if (children.size() !== 0) {
        d3.select(containerRef?.current).selectChildren().remove();
      }
      drawBarChart(values, containerRef.current);
    }
  }, [values, groupKey, keys, backgroundColor, drawBarChart]);

  return <div ref={containerRef} />;
};

export default BarChart;
