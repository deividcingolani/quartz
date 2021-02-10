import * as d3 from 'd3';
import { Box } from 'rebass';
import React, { FC, useEffect, useMemo, useRef } from 'react';

import { calcColor } from '../utils';
import { CorrelationItem } from '../../../types/feature-group';

export interface ListFeatureMinMaxCorrelationProps {
  name: string;
  data: CorrelationItem[];
}

const displayedValuesCount = 5;

const ListFeatureMinMaxCorrelation: FC<ListFeatureMinMaxCorrelationProps> = ({
  name,
  data,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const sorted = useMemo(() => {
    return data
      .slice()
      .filter(({ column }) => column !== name)
      .sort((a, b) => {
        return -Math.sign(a.correlation - b.correlation);
      });
  }, [data, name]);

  const highest = useMemo(() => {
    return sorted.slice(0, displayedValuesCount);
  }, [sorted]);

  const lowest = useMemo(() => {
    return sorted.slice(-displayedValuesCount);
  }, [sorted]);

  useEffect(() => {
    const container = d3.select(containerRef.current);

    container.selectAll('svg').remove();

    const svg = container
      .append('svg')
      .attr('width', sorted.length >= 10 ? 80 : sorted.length * 6)
      .attr('height', 5);

    let index = 0;

    if (sorted.length >= 10) {
      const lowestRects = svg
        .selectAll()
        .data(lowest, (d) => {
          return `low-${d?.correlation}-${d?.column}`;
        })
        .enter();

      lowestRects
        .append('rect')
        .data(lowest, (d) => {
          return d.correlation;
        })
        .attr('x', () => {
          return index++ * 6;
        })
        .attr('width', 5)
        .attr('height', 5)
        .style('opacity', (d) => 0.2 + Math.abs(d.correlation) * 0.8)
        .style('fill', (d) => {
          return calcColor(d.correlation);
        });

      svg
        .append('rect')
        .attr('x', 31)
        .attr('y', 2)
        .attr('width', 14)
        .attr('height', 1)
        .style('fill', '#A0A0A0');

      const highestRects = svg
        .selectAll()
        .data(highest, (d) => {
          return `high-${d?.correlation}-${d?.column}`;
        })
        .enter();

      highestRects
        .append('rect')
        .data(highest, (d) => {
          return d.correlation;
        })
        .attr('x', () => {
          return 47 + (index++ - 5) * 6;
        })
        .attr('width', 5)
        .attr('height', 5)
        .style('opacity', (d) => 0.2 + Math.abs(d.correlation) * 0.8)
        .style('fill', (d) => {
          return calcColor(d.correlation);
        });
    } else {
      const rects = svg
        .selectAll()
        .data(sorted, (d) => {
          return `${d?.correlation}-${d?.column}`;
        })
        .enter();

      rects
        .append('rect')
        .data(sorted, (d) => {
          return d.correlation;
        })
        .attr('x', () => {
          return index++ * 6;
        })
        .attr('width', 5)
        .attr('height', 5)
        .style('opacity', (d) => 0.2 + Math.abs(d.correlation) * 0.8)
        .style('fill', (d) => {
          return calcColor(d.correlation);
        });
    }
  }, [lowest, highest, sorted]);

  return <Box ref={containerRef} />;
};

export default ListFeatureMinMaxCorrelation;
