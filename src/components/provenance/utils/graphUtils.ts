import * as d3 from 'd3';
import ProvenanceGraph from '../model/ProvenanceGraph';
import Node from '../model/Node';
import { NodeAdjacentsType, NodeTypes } from '../types';

export const resizeSVGHeightToFit = (
  svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  gCoords: { width: number; height: number; y: number; x: number },
  maxHeight: number,
  margin: { top: number; bottom: number; left: number; right: number },
): number => {
  const expectedHeight = Math.abs(gCoords.height) + margin.top + margin.bottom;
  const newHeight = Math.min(maxHeight, expectedHeight);
  svg.attr('height', newHeight);
  return newHeight;
};

export const scaleGToFit = (
  svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  zoom: d3.ZoomBehavior<any, any>,
  gCoords: { width: number; height: number; y: number; x: number },
  width: number,
  newHeight: number,
  margin: { top: number; bottom: number; left: number; right: number },
): void => {
  const rescaleX = width / (gCoords.width + margin.left + margin.right);
  const rescaleY = newHeight / (gCoords.height + margin.top + margin.bottom);
  const rescale = Math.min(rescaleX, rescaleY);
  svg.call(zoom.scaleBy, rescale);
};

export const centerG = (
  svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  zoom: d3.ZoomBehavior<any, any>,
  gCoords: { width: number; height: number; y: number; x: number },
  width: number,
  newHeight: number,
  margin: { top: number; bottom: number; left: number; right: number },
): void => {
  const xDiff = width / 2 - gCoords.width / 2 + margin.left - gCoords.x;
  const yDiff = newHeight / 2 - gCoords.height / 2 + margin.top - gCoords.y;
  svg.call(zoom.translateBy, xDiff, yDiff);
};

export const initialCenter = (
  svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  width: number,
  margin: { top: number; bottom: number; left: number; right: number },
  zoom: d3.ZoomBehavior<any, any>,
  maxHeight: number,
): void => {
  const gCoords = svg.node()?.getBBox();
  if (gCoords) {
    // Increase svg width up to a maximum to fit content.
    const newHeight = resizeSVGHeightToFit(svg, gCoords, maxHeight, margin);
    // set g scale to fit in svg.
    scaleGToFit(svg, zoom, gCoords, width, newHeight, margin);
    // center g inside the svg.
    centerG(svg, zoom, gCoords, width, newHeight, margin);
  }
};

export const centerNode = (
  svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  zoom: d3.ZoomBehavior<any, any>,
  event: Event,
  element: Node,
  width: number,
  margin: { top: number; bottom: number; left: number; right: number },
): void => {
  const contCoords = svg.node()?.getBBox();
  if (contCoords) {
    const scale = d3.zoomTransform(event.target as HTMLElement).k;
    const elX = contCoords.x + element.position.x * scale + margin.right;
    const elY = contCoords.y + element.position.y * scale + margin.bottom;
    const xDiff = width / 2 - elX;
    const yDiff = contCoords.height / 2 - elY;
    svg.transition().duration(800).call(zoom.translateBy, xDiff, yDiff);
  }
};

export const passX = (
  nodeId: number,
  graph: ProvenanceGraph,
  NODE_SEP: number,
  dir: NodeAdjacentsType,
  prevX = 0,
): void => {
  const node = graph.getNode(nodeId);
  const separation = dir === NodeAdjacentsType.IN ? -NODE_SEP : +NODE_SEP;
  const x = prevX + separation;
  node.setX(x);
  node.getAdjByDir(dir).forEach((adjId: number) => {
    passX(adjId, graph, NODE_SEP, dir, x);
  });
};

export const firstPassX = (
  root: Node,
  graph: ProvenanceGraph,
  NODE_SEP: number,
): void => {
  root.getIn().map((id) => passX(id, graph, NODE_SEP, NodeAdjacentsType.IN));
  root.getOut().map((id) => passX(id, graph, NODE_SEP, NodeAdjacentsType.OUT));
};

export const firstY = (
  nodeId: number,
  graph: ProvenanceGraph,
  NODE_SEP: number,
  dir: NodeAdjacentsType,
): void => {
  const node = graph.getNode(nodeId);
  if (!node) return;

  const { prevSibling: prevSiblingId } = node;
  const children = node.getAdjByDir(dir);
  const prevSibling = prevSiblingId ? graph.getNode(prevSiblingId) : null;

  node.setY(prevSibling ? prevSibling.position.y + NODE_SEP : 0);

  if (children) {
    // Recursive call to visit all children
    children.forEach((n: number) => firstY(n, graph, NODE_SEP, dir));

    const { maxY, minY } = children.reduce(
      (acc: { maxY: number; minY: number }, id: number) => {
        const child = graph.getNode(id);
        acc.minY = Math.min(acc.minY, child.position.y);
        acc.maxY = Math.max(acc.maxY, child.position.y);
        return acc;
      },
      { maxY: -Infinity, minY: Infinity },
    );

    node.setModifier(node.position.y - (maxY - minY) / 2);
  }
};

export const firstPassY = (
  root: Node,
  graph: ProvenanceGraph,
  NODE_SEP: number,
): void => {
  root.getIn().map((id) => firstY(id, graph, NODE_SEP, NodeAdjacentsType.IN));
  root.getOut().map((id) => firstY(id, graph, NODE_SEP, NodeAdjacentsType.OUT));
};

export const secondY = (
  nodeId: number,
  graph: ProvenanceGraph,
  dir: NodeAdjacentsType,
  modSum = 0,
): void => {
  const node = graph.getNode(nodeId);
  if (!node) return;
  const { y, modifier } = node.position;
  node.setYFinal(y + modSum);

  node.getAdjByDir(dir).forEach((childId: number) => {
    secondY(childId, graph, dir, modifier + modSum);
  });
};

export const secondPassY = (root: Node, graph: ProvenanceGraph): void => {
  root.getIn().map((id) => secondY(id, graph, NodeAdjacentsType.IN));
  root.getOut().map((id) => secondY(id, graph, NodeAdjacentsType.OUT));
};

export const fixConflicts = (
  node: Node,
  graph: ProvenanceGraph,
  NODE_SEP: number,
  dir: NodeAdjacentsType,
): void => {
  if (!node) return;

  const adjacents = node.getAdjByDir(dir);

  adjacents.forEach((adjacent, idx) => {
    let botContour = -Infinity;
    const getterFn = (id: number) => graph.getNode(id);

    // Get the bottom-most contour position of the current node
    const child = graph.getNode(adjacent);
    const modifierFn = (n: Node) => {
      botContour = Math.max(botContour, n.position.yFinal);
    };

    if (child) child.visit(getterFn, modifierFn);

    // Get the topmost contour position of the node underneath the current one
    let topContour = Infinity;
    const nextChild = graph.getNode(adjacents[idx + 1]);
    if (nextChild) {
      nextChild.visit(getterFn, (n: Node) => {
        topContour = Math.min(topContour, n.position.yFinal);
      });
      if (botContour >= topContour) {
        nextChild.visit(getterFn, (n: Node) => {
          n.setYFinal(n.position.yFinal + botContour - topContour + NODE_SEP);
        });
      }
    }
    if (child) fixConflicts(child, graph, NODE_SEP, dir);
  });
};

export const fixNodeConflicts = (
  root: Node,
  graph: ProvenanceGraph,
  NODE_SEP: number,
): void => {
  fixConflicts(root, graph, NODE_SEP, NodeAdjacentsType.IN);
  fixConflicts(root, graph, NODE_SEP, NodeAdjacentsType.OUT);
};

export const getStrType = (type: NodeTypes): string => {
  const typeToLevelMap = {
    [NodeTypes.storageConnector]: 'storage-connectors',
    [NodeTypes.featureGroup]: 'fg',
    [NodeTypes.trainingDataset]: 'td',
    [NodeTypes.model]: 'model',
  } as any;
  return typeToLevelMap[type];
};
