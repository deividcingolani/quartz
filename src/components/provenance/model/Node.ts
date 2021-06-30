/* eslint-disable no-underscore-dangle */
/* eslint-disable object-curly-newline */
/* eslint-disable lines-between-class-members */

import {
  NodeAdjacents,
  NodeAdjacentsType,
  NodePosition,
  ProvenanceNode,
} from '../types';

class Node {
  value: any;
  adjacents: NodeAdjacents;
  position: NodePosition;
  prevSibling?: ProvenanceNode['id'];
  hidden: boolean;
  type?: NodeAdjacentsType;

  constructor(value: any, type?: NodeAdjacentsType) {
    this.value = value;
    this.hidden = false;
    this.prevSibling = undefined;
    this.adjacents = { in: new Set(), out: new Set() };
    this.type = type;
    this.position = { x: 0, y: 0, yFinal: 0, modifier: 0 };
  }

  public setX(x: number): void {
    this.position.x = x;
  }

  public setY(y: number): void {
    this.position.y = y;
  }

  public setYFinal(yFinal: number): void {
    this.position.yFinal = yFinal;
  }

  public setModifier(modifier: number): void {
    this.position.modifier = modifier;
  }

  public addAdjacent(key: number, type: NodeAdjacentsType): void {
    this.adjacents[type].add(key);
  }

  public removeAdjacent(key: number, type: NodeAdjacentsType): boolean {
    return this.adjacents[type].delete(key);
  }

  public getAdjByDir(type: NodeAdjacentsType): number[] {
    return Array.from(this.adjacents[type].values());
  }

  public getIn(): number[] {
    return Array.from(this.adjacents.in.values());
  }

  public getOut(): number[] {
    return Array.from(this.adjacents.out.values());
  }

  public getAdjacents(): number[] {
    return [
      ...Array.from(this.adjacents.in.values()),
      ...Array.from(this.adjacents.out.values()),
    ];
  }

  public isAdjacent(key: number): boolean {
    return this.adjacents.in.has(key) || this.adjacents.out.has(key);
  }

  public setPosition(position: NodePosition): void {
    this.position = position;
  }

  /**
   * Travel the node's subtree applying the function to each of the children.
   * @param getter getter function
   * @param cb modifier
   */
  public visit(getter: (id: number) => this, cb: (node: this) => void): void {
    const self = getter(this.value.id);
    cb(self);
    if (self.type === NodeAdjacentsType.IN) {
      if (self.getOut()) {
        self
          .getOut()
          .forEach((child: number) => getter(child).visit(getter, cb));
      }
    } else if (self.getIn()) {
      self.getIn().forEach((child: number) => getter(child).visit(getter, cb));
    }
  }
}

export default Node;
