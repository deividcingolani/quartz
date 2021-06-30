import { Colors, NodeTypes } from '../types';

export const typesMap = {
  FEATURE: NodeTypes.featureGroup,
  TRAINING_DATASET: NodeTypes.trainingDataset,
  MODEL: NodeTypes.model,
  EXPERIMENT: NodeTypes.experiment,
} as any;

export const colorsMap = {
  [NodeTypes.storageConnector]: Colors.red,
  [NodeTypes.featureGroup]: Colors.orange,
  [NodeTypes.trainingDataset]: Colors.purple,
  [NodeTypes.model]: Colors.skyblue,
  [NodeTypes.experiment]: Colors.yellow,
} as Record<NodeTypes, string>;
