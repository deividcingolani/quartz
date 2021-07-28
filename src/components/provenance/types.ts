export enum GraphDirection {
  DIRECTED = 'directed',
  UNDIRECTED = 'undirected',
}

export enum NodeAdjacentsType {
  IN = 'in',
  OUT = 'out',
}

export enum EventTarget {
  node = 'node',
  link = 'link',
  backdrop = 'backdrop',
}

export enum Colors {
  red = 'red',
  orange = 'orange',
  purple = 'purple',
  skyblue = 'skyblue',
  yellow = 'yellow',
  gray = 'gray',
}

export enum OutTypes {
  FEATURE = 'FEATURE',
  TRAINING_DATASET = 'TRAINING_DATASET',
  MODEL = 'MODEL',
  EXPERIMENT = 'EXPERIMENT',
}

export enum NodeTypes {
  storageConnector = 'storage connector',
  featureGroup = 'feature group',
  trainingDataset = 'training dataset',
  model = 'model',
  experiment = 'experiment',
  link = 'link',
}

export interface NodePosition {
  x: number;
  y: number;
  yFinal: number;
  modifier: number;
}

export interface NodeAdjacents {
  in: Set<number>;
  out: Set<number>;
}

export interface ProvenanceNodeData {
  name: string;
  features: number;
  updated: string;
  owner: string;
}
export interface ProvenanceNode {
  id: number;
  name: string;
  type: NodeTypes;
  data: ProvenanceNodeData;
}

export interface ProvenanceLink {
  source: ProvenanceNode['id'];
  target: ProvenanceNode['id'];
  type: NodeTypes;
  id?: number;
  data?: any;
}

export interface GraphLink {
  source: number;
  target: number;
  hidden: boolean;
}

export interface ProvenanceData {
  nodes: ProvenanceNode[];
  links: ProvenanceLink[];
}

export interface ProvenanceState {
  upstream: ProvenanceData;
  downstream: ProvenanceData;
  root: ProvenanceNode;
  count: number;
}

export interface ProvenanceGraphValue {
  nodes: ProvenanceNode[];
  links: ProvenanceLink[];
}

export interface ProvenanceGraphProps {
  panning?: boolean;
  root: ProvenanceNode;
  upstream: ProvenanceData;
  downstream: ProvenanceData;
  maxVisibleDepth?: number;
}
