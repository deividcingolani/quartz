/* eslint-disable lines-between-class-members */
import {
  ProvenanceLink,
  ProvenanceNode,
  NodeAdjacentsType,
  GraphDirection,
  ProvenanceData,
} from '../types';
import Graph from './Graph';
import Node from './Node';
import Queue from './Queue';

class ProvenanceGraph extends Graph<ProvenanceNode> {
  links: ProvenanceLink[];
  root: number;
  maxVisibleDepth: number;

  constructor({
    root,
    upstream,
    downstream,
    maxVisibleDepth,
  }: {
    root: ProvenanceNode;
    upstream: ProvenanceData;
    downstream: ProvenanceData;
    maxVisibleDepth: number;
  }) {
    super(GraphDirection.UNDIRECTED);
    this.links = [...upstream.links, ...downstream.links];
    this.root = root.id;
    this.addNodes(root, upstream.nodes, downstream.nodes);
    this.addLinks(upstream.links, downstream.links);
    this.maxVisibleDepth = maxVisibleDepth;
    // this.setInitialVisibility();
  }

  addNode(node: ProvenanceNode, type?: NodeAdjacentsType): void {
    const { id } = node;
    this.addVertex(id, node, type);
  }

  addNodes(
    root: ProvenanceNode,
    upstream: ProvenanceNode[],
    downstream: ProvenanceNode[],
  ): void {
    this.addNode(root);
    upstream.forEach((node: ProvenanceNode) =>
      this.addNode(node, NodeAdjacentsType.OUT),
    );
    downstream.forEach((node: ProvenanceNode) =>
      this.addNode(node, NodeAdjacentsType.IN),
    );
  }

  getNodes(): Node[] {
    return Array.from(this.nodes.values());
  }

  getNode(id: number): any {
    return this.nodes.get(id);
  }

  getRoot(): Node {
    return this.getNode(this.root);
  }

  getActiveNodes(): Node[] {
    return this.getNodes().filter((x: Node) => !x.hidden);
  }

  addLink(link: ProvenanceLink, type: NodeAdjacentsType): void {
    const { source, target } = link;
    this.addEdge(source, target, type);
  }

  addLinks(upstream: ProvenanceLink[], downstream: ProvenanceLink[]): void {
    upstream.forEach((l) => this.addLink(l, NodeAdjacentsType.IN));
    downstream.forEach((l) => this.addLink(l, NodeAdjacentsType.OUT));
  }

  getActiveLinks(): any[] {
    return this.links.filter((x: any) => !x.hidden);
  }

  setInitialVisibility(): Node[] {
    const visitor = this.bfs(this.root);
    const res = Array.from(visitor);
    return res;
  }

  isLeft(id: number): boolean {
    return this.getNode(id).type === NodeAdjacentsType.OUT;
  }

  isRight(id: number): boolean {
    return this.getNode(id).type === NodeAdjacentsType.IN;
  }

  getSubtree(id: number): number[] {
    const node = this.getNode(id);
    return this.isRight(id) ? node.getOut() : node.getIn();
  }

  /**
   * Breadth-first search
   * @param first
   */
  *bfs(first: number): Iterable<Node> {
    const visited = new Map();
    const visitList = new Queue<number>();

    visitList.enqueue(first);

    while (!visitList.isEmpty()) {
      const nodeId = visitList.dequeue();
      const node = nodeId ? this.getNode(nodeId) : null;
      if (node && !visited.has(node.value.id)) {
        yield node;
        visited.set(node.value.id, node);
        node.getAdjacents().forEach((adj: number) => visitList.enqueue(adj));
      }
    }
  }
}

export default ProvenanceGraph;
