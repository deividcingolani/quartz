import labelValueMap from '../../../utils/labelValueBind';
import { TrainingDataset } from '../../../types/training-dataset';
import { FeatureGroupBasket } from '../../../store/models/localManagement/basket.model';
import { Feature } from '../../../types/feature-group';

const mapFeaturesToName = (features: Feature[]) =>
  features.map(({ name }) => ({ name }));

export const mapFeatures = (featureGroups: FeatureGroupBasket[]) => {
  const [first, ...rest] = featureGroups;

  return {
    leftFeatureGroup: {
      id: first.fg.id,
    },
    leftFeatures: mapFeaturesToName(first.features),
    joins: rest.map(({ features, fg }) => ({
      query: {
        leftFeatureGroup: { id: fg.id },
        leftFeatures: mapFeaturesToName(features),
      },
    })),
  };
};

export const mapFeaturesToTable = (trainingDataset?: TrainingDataset) => {
  if (trainingDataset) {
    return [];
  }
  return [];
};

export const dataFormatMap = labelValueMap<{ [key: string]: string }>({
  'Tf Record': 'tfrecord',
  CSV: 'csv',
  Parquet: 'parquet',
  TSV: 'tsv',
  ORC: 'orc',
  Avro: 'avro',
});
