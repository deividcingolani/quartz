import { DataEntity } from '../../../types';
import { Feature, FeatureType } from '../../../types/feature-group';

const getMatchText = (item: any) => {
  delete item.highlights.otherXattrs;
  return `${Object.keys(item.highlights).join(', ')} matches`;
};

export const getFeaturesMatches = (features: Feature[]) => {
  return features.map((feature) => ({
    ...feature,
    matchText: getMatchText(feature),
    featureId: Math.ceil(Math.random() * 1000000),
    type:
      feature.features.find(({ name }) => name === feature.name)?.type ||
      FeatureType.int,
  }));
};

export const getFeatureGroupsAndTrainingDatasetsMatches = (
  items: DataEntity[],
) => {
  return items.map((item) => ({
    ...item,
    matchText: getMatchText(item),
  }));
};
