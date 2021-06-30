/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useEffect, useLayoutEffect, useMemo, useRef } from 'react';

import * as d3 from 'd3';
import ProvenanceGraph from '../model/ProvenanceGraph';
import buildGraph, {
  onBackDropClickParams,
  onEventParams,
} from './graphBuilder';
import { NodeTypes, ProvenanceData, ProvenanceNode } from '../types';

const MARGIN = { top: 20, right: 20, bottom: 20, left: 20 };
const MAX_HEIGHT = 1000;

export interface ProvenanceGraphProps {
  root: ProvenanceNode;
  colors: Record<NodeTypes, string>;
  upstream: ProvenanceData;
  downstream: ProvenanceData;
  panningEnabled?: boolean;
  maxVisibleDepth: number;
  onMouseEnter?: ({ event, type, element, graph }: onEventParams) => void;
  onMouseLeave?: ({ event, type, element, graph }: onEventParams) => void;
  onClick?: ({ event, type, element, graph }: onEventParams) => void;
  onBackdropClick?: ({ event, type }: onBackDropClickParams) => void;
}

const Provenance: FC<ProvenanceGraphProps> = ({
  root,
  upstream,
  colors,
  downstream,
  panningEnabled = true,
  maxVisibleDepth,
  onMouseEnter = () => {},
  onMouseLeave = () => {},
  onClick = () => {},
  onBackdropClick = () => {},
}: ProvenanceGraphProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const graph = useMemo(
    () =>
      new ProvenanceGraph({
        root,
        upstream,
        downstream,
        maxVisibleDepth,
      }),
    [root, upstream, downstream, maxVisibleDepth],
  );

  const centerXG = () => {
    const parent = containerRef.current?.parentElement as HTMLElement;
    const svg = d3.select(containerRef.current).select('svg') as any;
    const width = parent.offsetWidth;
    const gBBox = svg.node().getBBox();
    const onZoom = (ev: any) => svg.select('g').attr('transform', ev.transform);
    const zoom = d3.zoom().on('zoom', onZoom);
    const xDiff = width / 2 - gBBox.width / 2 - gBBox.x;
    svg.call(zoom.translateBy, xDiff, 0);
  };

  useEffect(() => {
    if (!panningEnabled) {
      window.addEventListener('resize', centerXG);
      return () => window.removeEventListener('resize', centerXG);
    }
    return () => {};
  }, [panningEnabled]);

  useLayoutEffect(() => {
    const container = containerRef?.current;
    if (container) {
      buildGraph({
        margin: MARGIN,
        maxHeight: MAX_HEIGHT,
        graphModel: graph,
        containerEl: container,
        panningEnabled,
        colors,
        onMouseEnter,
        onMouseLeave,
        onClick,
        onBackdropClick,
      });
    }
    return () => {
      d3.select(container).selectChildren().remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} />;
};

export default Provenance;
