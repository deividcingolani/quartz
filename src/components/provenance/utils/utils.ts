import { Colors, NodeTypes, OutTypes } from '../types';

export const rootTypesMap = {
  cachedFeaturegroupDTO: NodeTypes.featureGroup,
  trainingDatasetDTO: NodeTypes.trainingDataset,
} as any;

export const rootTypesToOut = {
  // FEATURE GROUP
  cachedFeaturegroupDTO: OutTypes.FEATURE,
  // TRAINING DATASET
  trainingDatasetDTO: OutTypes.TRAINING_DATASET,
  // EXPERIMENT
  experiment: OutTypes.EXPERIMENT,
  // MODEL
  model: OutTypes.MODEL,
} as any;

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
