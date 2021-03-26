import * as d3 from 'd3';
import { Box, Flex } from 'rebass';
import { Card } from '@logicalclocks/quartz';
import React, { FC, memo, useCallback, useEffect, useRef } from 'react';

// Types
import { CorrelationValue } from '../types';
import { FeatureGroupStatistics } from '../../../types/feature-group';
// Components
import TableGradient from './TableGradient';
import NoFeaturesSelected from '../NoFeaturesSelected';
// Utils
import { generateTableCellsValues, calcColor } from '../utils';
import { cropText } from '../../../pages/project/storage-connectors/utils';

export interface CorrelationTableProps {
  maxCount: number;
  changeMaxCount: (count: number) => void;
  correlation: { [key: string]: FeatureGroupStatistics };
  onPickCorrelation: (value: CorrelationValue) => void;
}

const tooltipOffset = {
  x: 12,
  y: -30,
};

export const minContainerWidth = 700;

export const margin = { top: 0, right: 30, bottom: 100, left: 100 };

const CorrelationTable: FC<CorrelationTableProps> = ({
  maxCount,
  changeMaxCount,
  correlation,
  onPickCorrelation,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const onResize = useCallback(() => {
    changeMaxCount(
      Math.floor(
        ((containerRef.current?.clientWidth || minContainerWidth) -
          margin.left) /
          26,
      ),
    );
  }, [changeMaxCount]);

  useEffect(() => {
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [onResize]);

  useEffect(() => {
    const container = d3.select(containerRef.current);

    const width = Object.keys(correlation).slice(0, maxCount).length * 26;
    const height = Object.keys(correlation).slice(0, maxCount).length * 26;

    container.selectAll('svg').remove();
    container.selectAll('p').remove();

    const svg = container
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const vertical = Object.keys(correlation).slice(0, maxCount);
    const horizontal = Object.keys(correlation).slice(0, maxCount);

    const calcX = d3.scaleBand().range([0, width]).domain(horizontal);

    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(calcX))
      .selectAll('text')
      .attr('id', function () {
        return `horizontal-${d3.select(this).text()}`;
      })
      .text((text) => cropText(text as string, 12))
      .attr('y', 0)
      .attr('x', -13)
      .attr('font-family', 'Inter')
      .attr('font-weight', 500)
      .attr('font-size', '12px')
      .attr('transform', 'rotate(-45)')
      .attr('color', '#A0A0A0')
      .style('text-anchor', 'end');

    const calcY = d3.scaleBand().range([height, 0]).domain(vertical);

    svg
      .append('g')
      .call(d3.axisLeft(calcY))
      .selectAll('text')
      .attr('id', function () {
        return `vertical-${d3.select(this).text()}`;
      })
      .text((text) => cropText(text as string, 12))
      .attr('font-family', 'Inter')
      .attr('font-weight', 500)
      .attr('font-size', '12px')
      .attr('color', '#A0A0A0')
      .style('text-anchor', 'end');

    svg.selectAll('.domain').remove();
    svg.selectAll('line').remove();

    const data = generateTableCellsValues(correlation, maxCount);

    const tooltip = d3
      .select(tooltipRef.current)
      .style('height', '25px')
      .style('position', 'absolute')
      .style('z-index', '10')
      .style('visibility', 'hidden')
      .style('background-color', '#272727')
      .style('display', 'flex')
      .style('align-items', 'center')
      .style('border-radius', '2px')
      .style('padding', '0 10px')
      .style('transform', 'translateX(-50%)');

    tooltip
      .append('svg')
      .style('height', 6)
      .style('width', 11)
      .style('view-box', '0 0 11 6')
      .style('margin-top', '31px')
      .style('position', 'absolute')
      .style('left', '50%')
      .style('transform', 'translateX(-50%)')
      .append('path')
      .attr('d', 'M5.53125 6L0.0625015 9.56186e-07L11 0L5.53125 6Z')
      .style('fill', '#272727');

    tooltip
      .append('p')
      .attr('class', 'value')
      .style('color', 'white')
      .style('font-family', 'Inter')
      .style('font-weight', 'bold')
      .style('margin-right', '10px')
      .style('font-size', '12px');
    tooltip
      .append('p')
      .attr('class', 'name')
      .style('color', '#A0A0A0')
      .style('font-family', 'Inter')
      .style('font-weight', 'bold')
      .style('font-size', '12px')
      .style('white-space', 'nowrap');

    const rects = svg
      .selectAll()
      .data(data, (d) => {
        // @ts-ignore
        return d.horizontal + ':' + d.vertical;
      })
      .enter();

    rects
      .append('rect')
      // @ts-ignore
      .attr('x', (d) => {
        return calcX(d.horizontal);
      })
      // @ts-ignore
      .attr('y', (d) => {
        return calcY(d.vertical);
      })
      .attr('width', 25)
      .attr('height', 25)
      .attr('id', (d) => {
        return `${d.vertical}-${d.horizontal}`;
      })
      .style('stroke', '#272727')
      .style('stroke-width', 0)
      .style('fill', '#E5E6E6')
      .on('mouseover', function (event, d) {
        d3.select(this).style('stroke-width', 1);
        d3.select(`#vertical-${d.vertical}`).style('color', '#272727');
        d3.select(`#horizontal-${d.horizontal}`).style('color', '#272727');
        const value = tooltip.select('.value');
        value.html(d.value.toFixed(4));
        const name = tooltip.select('.name');
        name.html(`${d.vertical} -> ${d.horizontal}`);

        tooltip.style('visibility', 'visible');
        tooltip
          .style('top', (calcY(d.vertical) || 0) + tooltipOffset.y + 'px')
          .style(
            'left',
            (calcX(d.horizontal) || 0) + tooltipOffset.x + margin.left + 'px',
          );
      })
      .on('mouseout', function (_, d) {
        d3.select(this).style('stroke-width', 0);
        d3.select(`#vertical-${d.vertical}`).style('color', '#A0A0A0');
        d3.select(`#horizontal-${d.horizontal}`).style('color', '#A0A0A0');

        tooltip.style('top', 0).style('left', 0);

        return tooltip.style('visibility', 'hidden');
      })
      .on('click', function (_, d) {
        d3.select(this).style('stroke-width', 1);
        d3.select(`#vertical-${d.vertical}`).style('color', '#e30303');
        d3.select(`#horizontal-${d.horizontal}`).style('color', '#ff0a0a');
        // d3.select(this).style('fill', 'red');
        onPickCorrelation(d);
      });

    rects
      .append('rect')
      .attr('x', (d) => {
        // @ts-ignore
        return calcX(d.horizontal) + (25 - Math.abs(d.value) * 21) / 2;
      })
      .attr('y', (d) => {
        // @ts-ignore
        return calcY(d.vertical) + (25 - Math.abs(d.value) * 21) / 2;
      })
      .attr('width', (d) => {
        return Math.abs(d.value) * 20 + 1;
      })
      .attr('height', (d) => {
        return Math.abs(d.value) * 20 + 1;
      })
      .style('opacity', (d) => 0.2 + Math.abs(d.value) * 0.8)
      .style('fill', (d) => {
        // @ts-ignore
        return calcColor(d.value);
      })
      .on('mouseover', (_, d) => {
        d3.select(`#${d.vertical}-${d.horizontal}`).style('stroke-width', 1);
        d3.select(`#vertical-${d.vertical}`).style('color', '#272727');
        d3.select(`#horizontal-${d.horizontal}`).style('color', '#272727');

        const value = tooltip.select('.value');
        value.html(d.value.toFixed(4));
        const name = tooltip.select('.name');
        name.html(`${d.vertical} -> ${d.horizontal}`);

        tooltip.style('visibility', 'visible');
        return tooltip
          .style('top', (calcY(d.vertical) || 0) + tooltipOffset.y + 'px')
          .style(
            'left',
            (calcX(d.horizontal) || 0) + tooltipOffset.x + margin.left + 'px',
          );
      })
      .on('mouseout', (_, d) => {
        d3.select(`#${d.vertical}-${d.horizontal}`).style('stroke-width', 0);
        d3.select(`#vertical-${d.vertical}`).style('color', '#A0A0A0');
        d3.select(`#horizontal-${d.horizontal}`).style('color', '#A0A0A0');

        tooltip.style('top', 0).style('left', 0);

        return tooltip.style('visibility', 'hidden');
      })
      .on('click', (_, d) => {
        onPickCorrelation(d);
      });
  }, [correlation, onPickCorrelation, maxCount]);

  if (!Object.keys(correlation).length) {
    return <NoFeaturesSelected />;
  }

  return (
    <Card>
      <Flex flexDirection="column">
        <Box sx={{ position: 'relative' }} ref={containerRef}>
          <Box sx={{ position: 'absolute' }} ref={tooltipRef} />
        </Box>
        <TableGradient />
      </Flex>
    </Card>
  );
};

export default memo(CorrelationTable);
