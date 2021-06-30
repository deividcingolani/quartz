class Queue<T> {
  elements: Array<T>;

  constructor() {
    this.elements = [];
  }

  enqueue(element: T): void {
    this.elements.push(element);
  }

  dequeue(): T | undefined {
    return this.elements.shift();
  }

  isEmpty(): boolean {
    return this.elements.length === 0;
  }
}

export default Queue;
