import { DataEntity } from '../../../types';
import { Feature } from '../../../types/feature';
import { StatisticsFeatureType } from '../../../types/feature-group';

const getMatchText = (item: any) => {
  return `${Object.keys(item.highlights).join(', ')}`;
};

const getMatchingToQueryParams = <T extends Feature | DataEntity>(
  data: T[],
  query: string[],
) => {
  return data.filter((item: T) => {
    const matches = Object.keys(item.highlights);
    return query.some((p) => matches.includes(p));
  });
};

const prepareHighlights = (item: any) => {
  let otherXattrs = {};
  if (item.highlights?.otherXattrs?.entry) {
    const attributesMap = {
      keywords: 'tags',
      creator: 'author',
    };

    otherXattrs = item.highlights.otherXattrs.entry.reduce(
      (acc: any, attr: any) => {
        const array = attr.key.split('.');
        const rawAttribute = array[array.length - 1];
        const attribute = (attributesMap as any)[rawAttribute];
        if (attribute) {
          acc[attribute] = attr.value;
        }
        return acc;
      },
      {},
    );
  }
  // eslint-disable-next-line no-param-reassign
  delete item.highlights.otherXattrs;
  // eslint-disable-next-line no-param-reassign
  item.highlights = { ...item.highlights, ...otherXattrs };
  return item;
};

export const getFeaturesMatches = (
  features: Feature[],
  query: string[],
): Feature[] => {
  const itemsCleaned: Feature[] = features.map(prepareHighlights);
  return getMatchingToQueryParams(itemsCleaned, query).map((feature) => ({
    ...feature,
    matchText: getMatchText(feature),
    featureId: Math.ceil(Math.random() * 1000000),
    type:
      feature.features.find(({ name }) => name === feature.name)?.type ||
      StatisticsFeatureType.int,
  }));
};

export const getFeatureGroupsAndTrainingDatasetsMatches = (
  items: DataEntity[],
  query: string[],
): DataEntity[] => {
  const itemsCleaned = items.map(prepareHighlights);
  return getMatchingToQueryParams(itemsCleaned, query).map((item) => ({
    ...item,
    matchText: getMatchText(item),
  }));
};

export const getFilteredCount = (data: any) => {
  const queryString = window.location.search;
  const queryParams = new URLSearchParams(queryString).getAll('match');
  const featureGroups = getMatchingToQueryParams(
    data.featuregroups.map(prepareHighlights),
    queryParams,
  );
  const trainingDatasets = getMatchingToQueryParams(
    data.trainingdatasets.map(prepareHighlights),
    queryParams,
  );
  const features = getMatchingToQueryParams(
    data.features.map(prepareHighlights),
    queryParams,
  );

  return {
    featureGroups: featureGroups.length,
    trainingDatasets: trainingDatasets.length,
    features: features.length,
  };
};
