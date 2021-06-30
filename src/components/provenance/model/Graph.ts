/* eslint-disable lines-between-class-members */
// eslint-disable-next-line import/no-cycle
import { GraphDirection, NodeAdjacentsType } from '../types';
import Node from './Node';

class Graph<T> {
  nodes: Map<number, Node>;
  edgeDirection: GraphDirection;

  constructor(edgeDirection = GraphDirection.UNDIRECTED) {
    this.nodes = new Map();
    this.edgeDirection = edgeDirection;
  }

  addVertex(key: number, value: T, type?: NodeAdjacentsType): void {
    const vertex = new Node(value, type);
    this.nodes.set(key, vertex);
  }

  addEdge(source: number, target: number, type: NodeAdjacentsType): void {
    const sourceNode = this.nodes.get(source);
    if (sourceNode) sourceNode.addAdjacent(target, type);
    const isUndirected = this.edgeDirection === GraphDirection.UNDIRECTED;
    if (isUndirected && this.nodes.has(target)) {
      const targetNode = this.nodes.get(target);
      const { IN, OUT } = NodeAdjacentsType;
      const t = type === IN ? OUT : IN;
      if (targetNode) targetNode.addAdjacent(source, t);
    }
  }
}

export default Graph;
