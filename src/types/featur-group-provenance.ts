/* eslint-disable import/no-cycle */
import { Entry } from './entry';
import { TrainingDataset } from './training-dataset';

export interface FeatureGroupProvenance {
  td: TrainingDataset;
  info: Entry;
}
