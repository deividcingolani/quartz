import * as d3 from 'd3';
import { Box } from 'rebass';
import React, { FC, useEffect, useRef } from 'react';

import { Colors } from '../types';

export interface CellProps {
  value: number;
}

const Cell: FC<CellProps> = ({ value }) => {
  const cellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = d3.select(cellRef.current);

    container.selectAll('svg').remove();

    const svg = container.append('svg').attr('width', 25).attr('height', 25);

    const calcColor = d3
      .scaleLinear()
      // @ts-ignore
      .domain([-1, 0, 1])
      // @ts-ignore
      .range([
        Colors.gradientBeginColor,
        Colors.gradientMiddleColor,
        Colors.gradientEndColor,
      ]);

    svg
      .append('rect')
      .attr('width', 25)
      .attr('height', 25)
      .style('fill', '#E5E6E6');

    svg
      .append('rect')
      .attr('x', () => {
        return (25 - Math.abs(value) * 21) / 2;
      })
      .attr('y', () => {
        return (25 - Math.abs(value) * 21) / 2;
      })
      .attr('width', () => {
        return Math.abs(value) * 20 + 1;
      })
      .attr('height', () => {
        return Math.abs(value) * 20 + 1;
      })
      .style('opacity', () => 0.2 + Math.abs(value) * 0.8)
      .style('fill', () => {
        return calcColor(value);
      });
  }, [value]);

  return <Box ref={cellRef} />;
};

export default Cell;
