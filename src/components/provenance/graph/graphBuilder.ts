/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-param-reassign */
import * as d3 from 'd3';
import ProvenanceGraph from '../model/ProvenanceGraph';
import {
  GraphLink,
  ProvenanceLink,
  EventTarget,
  NodeTypes,
  ProvenanceNode,
} from '../types';
import Node from '../model/Node';
import {
  initialCenter,
  centerNode,
  fixNodeConflicts,
  firstPassX,
  firstPassY,
  secondPassY,
} from '../utils/graphUtils';

const MAX_Y_SEP = 40;
const MAX_X_SEP = 150;

const nodeRadius = 3;
const rootNodeRadius = nodeRadius * 3;
const nodeBorder = nodeRadius - 1;
const rootNodeBorder = nodeRadius;

export interface onEventParams {
  event: Event;
  type: EventTarget;
  element: ProvenanceNode | ProvenanceLink;
  graph: ProvenanceGraph;
}
export interface onBackDropClickParams {
  event: Event;
  type: EventTarget;
}

export interface grapBuilderParams {
  maxHeight: number;
  colors: Record<NodeTypes, string>;
  panningEnabled: boolean;
  containerEl: HTMLElement;
  graphModel: ProvenanceGraph;
  margin: { top: number; right: number; bottom: number; left: number };
  onMouseEnter: ({ event, type, element, graph }: onEventParams) => void;
  onMouseLeave: ({ event, type, element, graph }: onEventParams) => void;
  onClick: ({ event, type, element, graph }: onEventParams) => void;
  onBackdropClick: ({ event, type }: onBackDropClickParams) => void;
}

export default ({
  graphModel,
  containerEl,
  panningEnabled,
  margin,
  colors,
  maxHeight,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onBackdropClick,
}: grapBuilderParams): void => {
  const parent = containerEl.parentElement as HTMLElement;
  const width = parent.offsetWidth;
  const height = parent.offsetHeight;

  let selected: { type: EventTarget; el: HTMLElement } | null = null;
  const setSelected = (
    selection: { type: EventTarget; el: HTMLElement } | null,
  ) => {
    selected = selection;
  };

  /* ************************* APPEND CONTAINER ***************************** */
  // append the svg object to the body of the page
  const svg = d3
    .select('div')
    .append('svg')
    .attr('id', 'provenance-svg')
    .attr('width', '100%')
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .attr('height', height);

  // Append container and place it.
  const container = svg
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)
    .style('cursor', 'pointer');

  /* **************************** ZOOM OBJECT ******************************* */
  // create zoom object
  const zoom = d3
    .zoom<any, any>()
    .scaleExtent([0.5, 1])
    .on('zoom', (event) => {
      // svg.style('cursor', 'pointer');
      svg.select('g').attr('transform', event.transform);
    });

  // enable zoom if panning prop is true.
  if (panningEnabled) svg.call(zoom);

  /* *********************** ELEMENTS SELECTION ***************************** */
  const unselectNode = (node: HTMLElement) => {
    d3.select(node)
      .select('text')
      .transition()
      .duration(200)
      .style('font-weight', '400');
    d3.select(node)
      .select('circle')
      .transition()
      .duration(200)
      .style('fill', () => 'rgba(0,0,0,0)');
  };

  const unselectLink = (node: HTMLElement) => {
    d3.select(node)
      .transition()
      .duration(200)
      .style('stroke', '#aaa')
      .style('stroke-width', '1.5px');
  };

  const unselect = ({ el, type }: { el: HTMLElement; type: EventTarget }) => {
    if (type === EventTarget.link) {
      unselectLink(el);
    } else {
      unselectNode(el);
    }
  };

  // Handle backdrop click
  svg.on('click', (event) => {
    if (selected) {
      unselect(selected);
      selected = null;
    }
    if (typeof onBackdropClick === 'function') {
      onBackdropClick({ event, type: EventTarget.backdrop });
    }
  });

  /* *************************** ELEMENTS HOVER ***************************** */
  const handleMouseEnter = (
    event: Event,
    type: EventTarget,
    element: Node['value'] | ProvenanceLink,
  ) => {
    if (typeof onMouseEnter !== 'function') return;
    onMouseEnter({ event, type, element, graph: graphModel });
  };

  const handleMouseLeave = (
    event: Event,
    type: EventTarget,
    element: Node['value'] | ProvenanceLink,
  ) => {
    if (typeof onMouseLeave !== 'function') return;
    onMouseLeave({ event, type, element, graph: graphModel });
  };

  /* ************************** UPDATE FUNCTION ***************************** */
  const update = (graph: ProvenanceGraph, initialRender = false) => {
    const transitionTime = initialRender ? 0 : 100;

    // Get visible nodes and links
    const activeNodes = graph.getActiveNodes();
    const activeLinks = graph.getActiveLinks();

    const root = graph.getRoot();

    // Set previous siblings
    activeNodes.forEach((node: Node) => {
      let siblings = [];
      if (node.value.id === root.value.id) {
        siblings = [root.value.id];
      } else if (graph.isLeft(node.value.id)) {
        [siblings] = node.getOut().map((n) => graph.getNode(n).getIn());
      } else {
        [siblings] = node.getIn().map((n) => graph.getNode(n).getOut());
      }
      const position = siblings.indexOf(node.value.id) - 1;
      node.prevSibling = position > -1 ? siblings[position] : null;
    });

    const rootNode = graph.getRoot();

    firstPassX(rootNode, graph, MAX_X_SEP);
    firstPassY(rootNode, graph, MAX_Y_SEP);
    secondPassY(rootNode, graph);
    fixNodeConflicts(rootNode, graph, MAX_Y_SEP);

    const handleClick = (ev: Event, type: EventTarget, element: Node) => {
      ev.stopPropagation();
      // Remove previous selection
      if (selected) unselect(selected);
      if (selected && selected.el === ev.currentTarget) {
        selected = null;
      } else {
        setSelected({ el: ev.currentTarget as HTMLElement, type });
        if (!selected) return;
        if (type === EventTarget.node) {
          d3.select(selected.el).select('text').style('font-weight', '600');
          d3.select(selected.el)
            .select('circle')
            .style('fill', (d: any) => colors[d.value.type as NodeTypes]);
        } else {
          d3.select(selected.el)
            .style('stroke', 'black')
            .style('stroke-width', '2px');
        }
      }
      // if (graphModel.getChildren(d.value.id)) {
      //   graphModel.hideBranch(d);
      // } else {
      //   graphModel.showBranch(d);
      // }
      // update(graphModel);
      if (typeof onClick === 'function') {
        onClick({
          event: ev,
          type,
          element: type === EventTarget.node ? element.value : element,
          graph: graphModel,
        });
      }
      if (panningEnabled) centerNode(svg, zoom, ev, element, width, margin);
    };

    const setNodesOpacity = (__d: Node) => {
      // const subtree = graph.getSubtree(d.value.id);
      // return subtree && subtree.length > 0 ? 1 : 0.7;
      return 1;
    };

    // Get y position for a given node
    const y = (d: Node) => d.position.yFinal;

    // Get y position for a given node
    const x = (d: Node) => d.position.x;

    // Initialize nodes groups
    const node = container
      .selectAll<SVGGElement, Node>('g')
      .data(activeNodes, (d: Node) => d.value.id);

    // New nodes to be included.
    const nodeEnter = node
      .enter()
      .append('g')
      .attr('transform', (d: Node) => {
        const inNode = graph.getNode(d.getIn()[0]);
        const position = inNode?.position?.x
          ? inNode.position
          : { x: x(d), y: y(d) };
        return `translate(${position.x},${inNode?.position.yFinal || 0})`;
      })
      .on('click', (ev, d) => handleClick(ev, EventTarget.node, d))
      .on('mouseenter', (ev, d) => {
        d3.select(ev.currentTarget)
          .select('text')
          .transition()
          .duration(200)
          .style('font-weight', '600');
        // d3.select(ev.currentTarget)
        //   .select('circle')
        //   .transition()
        //   .duration(200)
        //   .style('fill', (d: any) => colors[d.value.type as NodeTypes]));
        handleMouseEnter(ev, EventTarget.node, d.value);
      })
      .on('mouseleave', (ev) => {
        if (ev.currentTarget === selected?.el) return;
        d3.select(ev.currentTarget)
          .select('text')
          .transition()
          .duration(200)
          .style('font-weight', '400');
        d3.select(ev.currentTarget)
          .select('circle')
          .transition()
          .duration(200)
          .style('fill', () => 'rgba(0,0,0,0)');
        handleMouseLeave(ev, EventTarget.node, null);
      });

    // Populate the group
    nodeEnter
      .append('circle')
      .attr('r', (d) => {
        if (d.value.id === graph.root) {
          return rootNodeRadius;
        }
        return nodeRadius;
      })
      .style('fill', (__d) => 'rgba(0,0,0,0)')
      .style('opacity', setNodesOpacity)
      .style('stroke', (d) => colors[d.value.type as NodeTypes])
      .style('stroke-width', (d) =>
        d.value.id === graph.root ? rootNodeBorder : nodeBorder,
      );

    // All new nodes
    const nodeUpdate = nodeEnter.merge(node);

    // Place nodes
    nodeUpdate
      .transition()
      .duration(transitionTime * 4)
      .attr('transform', (d) => {
        d.setPosition({ ...d.position, x: x(d), y: y(d) });
        return `translate(${d.position.x},${d.position.y})`;
      })
      // Lower opacity when opened.
      .select('circle')
      .style('opacity', setNodesOpacity);

    nodeUpdate
      .select('text')
      .transition()
      .duration(transitionTime * 2)
      .attr('text-anchor', (d) => {
        return d.getIn().length === 0 ||
          (d.getIn().length > 0 && d.getOut().length > 0)
          ? 'middle'
          : 'right';
      })
      .attr('transform', (d) => {
        let isLeaf = false;

        if (graph.isRight(d.value.id)) {
          isLeaf = d.getOut().length === 0;
          if (isLeaf) return `translate(${10}, ${5})`;
        }
        return `translate(${0}, ${-10})`;
      });

    // Remove any exiting nodes
    const nodeExit = node
      .exit<Node>()
      .transition()
      .duration(transitionTime * 3)
      .attr('transform', (d: Node) => {
        const parentPos = graph.getNode(d.getIn()[0])?.position || d.position;
        return `translate(${parentPos.x},${parentPos.y})`;
      })
      .remove();

    // On exit reduce the node circles size to 0
    nodeExit.select('circle').attr('r', 0);

    // On exit reduce the opacity of text labels
    nodeExit.select('text').style('fill-opacity', 0);

    // Initialize the links
    const link = container
      .selectAll<SVGPathElement, GraphLink>('path')
      .data(activeLinks, (d: GraphLink) => graph.getActiveLinks().indexOf(d));

    // New links at the parent's previous position.
    const sourcePos = (d: ProvenanceLink) => {
      const isTargetRight = graph.isRight(d.target);
      const sourceNode = graph.getNode(d.source);
      const position = sourceNode?.position;
      const isRoot = sourceNode.value.id === graph.root;
      const radius = isRoot ? rootNodeRadius : nodeRadius;
      const border = isRoot ? rootNodeBorder : nodeBorder;
      if (position) {
        return isTargetRight
          ? [position.x + radius + border, position.y]
          : [position.x - radius - border, position.y];
      }
      return [0, 0];
    };
    const targetPos = (d: ProvenanceLink) => {
      const isTargetRight = graph.isRight(d.target);
      const position = graph.getNode(d.target)?.position;
      if (position) {
        return isTargetRight
          ? [position.x - (nodeRadius + nodeBorder), position.y]
          : [position.x + (nodeRadius + nodeBorder), position.y];
      }
      return [0, 0];
    };

    const line = d3.linkHorizontal<SVGPathElement, ProvenanceLink, number[]>();

    const linkEnter = link
      .enter()
      .append('path')
      .style('stroke', '#aaa')
      .style('stroke-width', '1.5px')
      .style('fill', 'none')
      .attr('d', line.source(sourcePos).target(targetPos))
      .on('click', (ev, d) => handleClick(ev, EventTarget.link, d))
      .on('mouseenter', (ev, d) => {
        d3.select(ev.currentTarget)
          .transition()
          .duration(200)
          .style('stroke', 'black');
        handleMouseEnter(ev, EventTarget.link, d);
      })
      .on('mouseleave', (ev, __d) => {
        if (ev.currentTarget === selected?.el) return;
        unselectLink(ev.currentTarget);
        handleMouseLeave(ev, EventTarget.link, null);
      });

    // All links
    const linkUpdate = linkEnter.merge(link);

    // Place links
    linkUpdate
      .transition()
      .duration(transitionTime * 4)
      .attr('d', line.source(sourcePos).target(targetPos));

    // Remove any exiting links
    link
      .exit<ProvenanceLink>()
      .transition()
      .duration(50)
      .attr('d', line.source(sourcePos).target(sourcePos))
      .remove();

    // Add the legends
    nodeEnter
      .append('text')
      .text((d: Node) => d.value.name || '')
      .style('user-select', 'none')
      .attr('font-size', '12px')
      .attr('font-family', 'Inter')
      .attr('text-anchor', (d) => {
        const hasLeft = !!d.getIn().length;
        const hasRight = !!d.getOut().length;
        if (hasLeft && hasRight) {
          return 'middle';
        }
        return hasLeft ? 'start' : 'end';
      })
      .attr('transform', (d) => {
        let x = 0;
        let y = 0;
        const hasLeft = !!d.getIn().length;
        const hasRight = !!d.getOut().length;
        const isRoot = d.value.id === graph.root;
        const unit = isRoot
          ? rootNodeRadius * 2 + rootNodeBorder
          : nodeRadius * 4 + nodeBorder;
        if (hasLeft && hasRight) {
          y = -unit;
        } else if (hasLeft) {
          x = unit;
          y -= -(isRoot
            ? rootNodeRadius / 2
            : (nodeRadius + nodeBorder * 2) / 2);
        } else {
          x = -unit;
          y -= -(isRoot
            ? rootNodeRadius / 2
            : (nodeRadius + nodeBorder * 2) / 2);
        }

        return `translate(${x}, ${y})`;
      });
  };

  /* ************************ APPEND GRAPH TO DOM *************************** */
  update(graphModel, true);
  // Set short delay to allow the graph to be properly created before updating
  // applying initial size and position transformations.
  setTimeout(() => {
    initialCenter(svg, width, margin, zoom, maxHeight);
    containerEl.appendChild(svg.node() as SVGGElement);
  }, 0);
};
